import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
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
                    <Button color="inherit" onClick={() => navigate('/administrar/doctores')}>
                        Doctores
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/administrar/pacientes')}>
                        Pacientes
                    </Button>
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