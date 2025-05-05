const HandleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

export default HandleLogout;