import Cookies from 'universal-cookie';

export const cookies = new Cookies();

export const getCookie = (parameter) => {
    console.log("parameters of cookies in child",parameter)
    return (
        cookies.get(parameter)
    );
};
/*
export const setCookie = (parameter) => {
    return (
        cookies.set(parameter)
    );
}*/