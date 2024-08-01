import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { getPostcodeDetails, verifyPAN } from '../Store/Api';
import '../Components/formcss.css'
const Form = () => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers);

  const initialFormState = {
    pan: '',
    fullName: '',
    email: '',
    mobileNumber: '',
    addresses: [{ addressLine1: '', addressLine2: '', postcode: '', state: '', city: '' }],
  };

  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === 'postcode' && value.length === 6) {
      getPostcodeDetails(value).then((response) => {
        const updatedAddresses = form.addresses.map((address, i) =>
          i === index
            ? {
                ...address,
                postcode: value,
                state: response.data.state[0].name,
                city: response.data.city[0].name,
              }
            : address
        );
        setForm({ ...form, addresses: updatedAddresses });
      });
    } else if (name.includes('address')) {
      const updatedAddresses = form.addresses.map((address, i) =>
        i === index ? { ...address, [name.split('-')[1]]: value } : address
      );
      setForm({ ...form, addresses: updatedAddresses });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddAddress = () => {
    if (form.addresses.length < 10) {
      setForm({
        ...form,
        addresses: [...form.addresses, { addressLine1: '', addressLine2: '', postcode: '', state: '', city: '' }],
      });
    }
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = form.addresses.filter((_, i) => i !== index);
    setForm({ ...form, addresses: updatedAddresses });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      const confirmUpdate = window.confirm("Do you want to update the customer data?");
      if (confirmUpdate) {
        dispatch({ type: 'UPDATE_CUSTOMER', payload: { index: editIndex, customer: form } });
        setIsEditing(false);
        setEditIndex(null);
        setForm(initialFormState);
      } else {
        console.log("Update cancelled");
      }
    } else {
      dispatch({ type: 'ADD_CUSTOMER', payload: form });
      alert("Customer data added successfully");
      setForm(initialFormState);
    }
  };
  

  const handlePanBlur = () => {
    if (form.pan.length === 10) {
      verifyPAN(form.pan).then((response) => {
        if (response.data.isValid) {
          setForm({ ...form, fullName: response.data.fullName });
        }
      });
    }
  };

  const handleEdit = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setForm(customers[index]);
  };
  return (
    <Container maxWidth="md" className="container">
      <Typography variant="h3 " component="h1" gutterBottom   sx={{ fontFamily: 'auto',fontWeight: 'bold'}}>
        Customer Registration
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="PAN"
              name="pan"
              value={form.pan}
              onChange={handleChange}
              onBlur={handlePanBlur}
              fullWidth
              required
              inputProps={{ maxLength: 10, pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ maxLength: 140 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ maxLength: 255 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ maxLength: 10, pattern: '[0-9]{10}' }}
              InputProps={{
                startAdornment: <Typography variant="subtitle1">+91</Typography>,
              }}
            />
          </Grid>
          {form.addresses.map((address, index) => (
            <Grid item xs={12} key={index}>
              <Box className="address-box">
                <Typography variant="h6" className="address-title"   sx={{ fontSize:'xx-large',fontFamily: 'auto',fontWeight: 'bold'}}>
                  Address {index + 1}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Address Line 1"
                      name={`address-addressLine1`}
                      value={address.addressLine1}
                      onChange={(e) => handleChange(e, index)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Address Line 2"
                      name={`address-addressLine2`}
                      value={address.addressLine2}
                      onChange={(e) => handleChange(e, index)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Postcode"
                      name={`address-postcode`}
                      value={address.postcode}
                      onChange={(e) => handleChange(e, index)}
                      fullWidth
                      required
                      inputProps={{ maxLength: 6, pattern: '[0-9]{6}' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="State"
                      name={`address-state`}
                      value={address.state}
                      onChange={(e) => handleChange(e, index)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      name={`address-city`}
                      value={address.city}
                      onChange={(e) => handleChange(e, index)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {index > 0 && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemoveAddress(index)}
                      >
                        Remove Address
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              className="add-button"
              variant="contained"
              onClick={handleAddAddress}
              disabled={form.addresses.length >= 10}
            >
              Add Another Address
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box className="submit-button">
              <Button type="submit" variant="contained" color="primary">
                {isEditing ? 'Update' : 'Submit'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <Typography variant="h5" component="h2" gutterBottom mt={4} sx={{ fontSize:'xx-large',fontFamily: 'auto',fontWeight: 'bold'}}>
        Customer List
      </Typography>
      <List>
        {customers.map((customer, index) => (
          <ListItem key={index} className="list-item">
            <ListItemText primary={`${customer.fullName} (${customer.pan})`} />
            <IconButton className="icon-button" onClick={() => handleEdit(index)}>
              <Edit />
            </IconButton>
            <IconButton
              className="icon-button"
              onClick={() => dispatch({ type: 'DELETE_CUSTOMER', payload: index })}
            >
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Form;
