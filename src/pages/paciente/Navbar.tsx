import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Menu,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Navbar = () => {
    const navigate = useNavigate();
    const [citasAnchorEl, setCitasAnchorEl] = useState<null | HTMLElement>(null);

    const handleCitasMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setCitasAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setCitasAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Mi Aplicación
                </Typography>

                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                    <Button color="inherit" onClick={() => navigate('/home')}>
                        Inicio
                    </Button>

                    <Button
                        color="inherit"
                        onClick={handleCitasMenuOpen}
                        endIcon={<ExpandMoreIcon />}
                    >
                        Citas
                    </Button>
                    <Menu
                        anchorEl={citasAnchorEl}
                        open={Boolean(citasAnchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => {
                            navigate('/citas/agendar');
                            handleMenuClose();
                        }}>
                            Agendar Cita
                        </MenuItem>
                        <MenuItem onClick={() => {
                            navigate('/citas/visualizar');
                            handleMenuClose();
                        }}>
                            Visualizar cita
                        </MenuItem>
                        <MenuItem onClick={() => {
                            navigate('/citas/historial');
                            handleMenuClose();
                        }}>
                            Historial
                        </MenuItem>
                    </Menu>
                </Box>

                <Button color="inherit" onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/');
                }}>
                    Cerrar Sesión
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;