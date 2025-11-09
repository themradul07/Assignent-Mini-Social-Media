import React, { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    CircularProgress,
    Link,
} from "@mui/material";
import "./styles/AuthForm.css";
import { postJSON } from "../api";

export default function AuthForm({ onLogin }) {
    const [mode, setMode] = useState("login"); // 'login' or 'signup'
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    

    const isSignup = mode === "signup";

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isSignup ){ 
                const res = await postJSON('/auth/signup',form);
                if(res.token) onLogin(res);
                else alert(res.msg || 'Signup failed');
              
            }
            else if (onLogin) {
                const res = await postJSON('/auth/login', form);
                if (res.token) onLogin(res);
                else alert(res.msg || 'Login failed');
               
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(isSignup ? "login" : "signup");
        setForm({ name: "", email: "", password: "" });
    };

    return (
        <Paper elevation={3} className="auth-form-paper">
            <Typography variant="h5" align="center" gutterBottom>
                {isSignup ? "Create Account" : "Welcome Back"}
            </Typography>

            <form onSubmit={handleSubmit}>
                {isSignup && (
                    <TextField
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                )}

                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <Box mt={2}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : isSignup ? (
                            "Sign Up"
                        ) : (
                            "Login"
                        )}
                    </Button>
                </Box>
            </form>

            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                    {isSignup ? "Already have an account?" : "Not registered yet?"}{" "}
                    <Link
                        component="button"
                        variant="body2"
                        underline="hover"
                        onClick={toggleMode}
                    >
                        {isSignup ? "Login" : "Sign up"}
                    </Link>
                </Typography>
            </Box>
        </Paper>
    );
}
