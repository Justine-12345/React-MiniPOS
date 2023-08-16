import React from 'react'
import { toast } from 'react-toastify';
import { Id, Toast } from 'react-toastify/dist/types';

export const toastSuccess = (message: string) => toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});


export const toastError = (message: string) => toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});

export const toastLoading = (message?: string) => toast.loading(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
});



export const toastLoadingSuccess = (message: string, ID: Id) => toast.update(ID, { autoClose: 2000, render: message, type: "success", isLoading: false });

export const toastLoadingError = (message: string, ID: Id) => toast.update(ID, { autoClose: false, render: message, type: "error", isLoading: false });


