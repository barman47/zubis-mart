$(document).ready(function () {
    $('select').formSelect();

    const deleteProductIcon = document.querySelectorAll('.delete-products-icon');
    const deleteServiceIcon = document.querySelectorAll('.delete-services-icon');

    const homeLink = document.querySelector('.active');
    const accountLink = document.querySelector('.account');
    homeLink.classList.remove('active');
    accountLink.classList.add('active');

    const serviceForm = document.addServiceForm;
    const itemForm = document.addItemForm;
    const editForm = document.editDataForm;
    const removeAccountForm = document.removeAccountForm;
    const changePasswordForm = document.changePasswordForm;

    const serviceLoader = document.querySelector('#addServiceLoader');
    const addItemLoader = document.querySelector('#addItemLoader');
    const removeAccountLoader = document.querySelector('#removeAccountLoader');
    const editDataLoader = document.querySelector('#editDataLoader');
    const changePasswordLoader = document.querySelector('#changePasswordLoader');

    const serviceCategory = serviceForm.seviceCategory;
    const serviceDescription = serviceForm.serviceDescription;

    const cancelButton = document.querySelector('#cancelButton');
    const editButton = document.querySelector('#editButton');
    const saveButton = document.querySelector('#saveButton');

    const editInputs = [
        editForm.editFirstName,
        editForm.editLastName,
        editForm.editEmail,
        editForm.editPhone,
        editForm.editPassword
    ];

    const saleItems = [
        itemForm.itemName,
        itemForm.itemPrice,
        itemForm.itemCategory,
        itemForm.itemDescription,
        itemForm.fileField
    ];

    const removeAccountPassword = removeAccountForm.removeAccountPassword;
    const userId = document.getElementById('username').getAttribute('data-id');
    const userEmail = document.getElementById('username').getAttribute('data-email');
    const phone = document.getElementById('username').getAttribute('data-phone');

    const serviceDescriptionNumberOfCharacters = document.querySelector('#serviceDescriptionCharacters');
    const itemDescriptionNumberOfCharacters = document.querySelector('#itemDescriptionCharacters');

    const emailRegExp = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    const phoneRegExp = /^\d{11}$/;
    const passwordRegExp = /^[\w@-]{8,20}$/;

    function isEmpty (element) {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    function submitChangePasswordForm (event) {
        event.preventDefault();
        if (isEmpty(changePasswordForm.oldPassword)) {
            changePasswordForm.oldPassword.classList.add('invalid');
            changePasswordForm.oldPassword.focus();
        } else if (isEmpty(changePasswordForm.newPassword)) {
            changePasswordForm.newPassword.classList.add('invalid');
            changePasswordForm.newPassword.focus();
        } else if (isEmpty(changePasswordForm.confirmPassword)) {
            changePasswordForm.confirmPassword.classList.add('invalid');
            changePasswordForm.confirmPassword.focus();
        } else if (changePasswordForm.confirmPassword.value !== changePasswordForm.newPassword.value) {
            changePasswordForm.confirmPassword.classList.add('invalid');
            changePasswordForm.confirmPassword.focus();
        } else {
            changePasswordLoader.style.visibility = 'visible';
            $('#changePasswordForm :input').prop('disabled', true);
            $.ajax({
                url: `/users/${userId}/changePassword`,
                type: 'PUT',
                data: {
                    oldPassword: $('#oldPassword').val(),
                    newPassword: $('#newPassword').val()
                },
                statusCode: {
                    401: function (msg, status, jqXHR) {
                        $('#changePasswordForm :input').prop('disabled', false);
                        changePasswordLoader.style.visibility = 'hidden';
                        $('#oldPasswordErrorMessage').html(msg.responseJSON.message);
                        $('#oldPassword').focus();
                    },
                    500: function (msg, status, jqXHR) {
                        $('#changePasswordForm :input').prop('disabled', false);
                        changePasswordLoader.style.visibility = 'hidden';
                        M.toast({ html: msg.responseJSON.message });
                    },
                }
            }).fail(function (jqXHR, textStatus) {
                $('#changePasswordForm :input').prop('disabled', false);
                changePasswordLoader.style.visibility = 'hidden';
                M.toast({ html: 'Something went wrong. Please try again.' });

            }).done(function (msg, status, jqXHR) {
                $('#changePasswordForm :input').prop('disabled', false);
                $('#changePasswordForm :input').val('');
                changePasswordLoader.style.visibility = 'hidden';
                M.toast({ html: 'Password Changed Successfully' });
                setTimeout(function () {
                    $('.modal').modal('close');
                }, 3000);
            });
        }
    }

    function submitServiceForm (event) {
        event.preventDefault();
        if (isEmpty(serviceCategory)) {
            M.toast({ html: 'Please provide a service' });
            serviceCategory.focus();
        } else if (isEmpty(serviceDescription)) {
            M.toast({ html: 'Please enter a description for your service' });
            serviceDescription.classList.add('invalid');
            serviceDescription.focus();
        } else {
            serviceCategory.classList.remove('invalid');
            serviceDescription.classList.remove('invalid');
            serviceLoader.style.visibility = 'visible';
            $('#addServiceButton').html('ADDING SERVICE...');
            $('#addServiceForm :input').prop('disabled', true);
            $.ajax({
                method: 'POST',
                url: '/users/addService',
                dataType: 'json',
                data: {
                    category: serviceCategory.value,
                    description: serviceDescription.value,
                    userEmail: userEmail,
                    userName: $('#username').html().toUpperCase(),
                    phone: phone
                },
                statusCode: {
                    406: function (msg, status, jqXHR) {
                        console.log(status);
                    },
                    501: function (msg, status, jqXHR) {
                        console.log(status);
                    }
                }
            }).done(function (msg, status, jqXHR) {
                serviceLoader.style.visibility = 'hidden';
                console.log(status);
                M.toast({ 
                    html: 'Service added Successfully.',
                    displayLength: 6000
                });
                $('#addServiceForm :input').prop('disabled', false);
                $('#addServiceButton').html('ADD SERVICE');
                addServiceForm.reset();
                setTimeout(function () {
                    $('.modal').modal('close');
                }, 3000);

                const tableRow = document.createElement('tr');
                const tableBody = document.getElementById('servicesTableBody');

                const tableDataCategory = document.createElement('td');
                const tableDataDescription = document.createElement('td');
                const tableDataAction = document.createElement('td');

                const deleteIcon = document.createElement('span');

                // deleteIcon.setAttribute('class', 'mdi mdi-delete-outline services-icon');
                deleteIcon.classList.add('mdi','mdi-delete-outline', 'delete-services-icon');
                deleteIcon.setAttribute('data-tooltip', 'Remove Item');

                const serviceCategory = document.createTextNode(msg.category);
                tableDataCategory.appendChild(serviceCategory);

                const serviceDescription = document.createTextNode(msg.category);
                tableDataDescription.appendChild(serviceDescription);

                tableDataAction.appendChild(deleteIcon);

                tableRow.appendChild(tableDataCategory);
                tableRow.appendChild(tableDataDescription);
                tableRow.appendChild(tableDataAction);

                tableBody.appendChild(tableRow);
            }).fail(function (jqXHR, textStatus) {
                serviceLoader.style.visibility = 'hidden';
                M.toast({ html: 'Service not added! Try again.' });
                $('#addServiceForm :input').prop('disabled', false);
                $('#addServiceButton').html('ADD SERVICE');
            });
        }
    }

    deleteProductIcon.forEach(function (icon) {
        icon.addEventListener('click', function (event) {
            var deleteProduct = confirm("Are you sure you want to remove this item?");
            if (deleteProduct === true) {
                $(event.target.parentElement.parentElement).remove();
                $.ajax({
                    url: '/users/removeProduct',
                    type: 'DELETE',
                    data: {
                        id: event.target.dataset.id
                    },
                    statusCode: {
                        501: function (msg, status, jqXHR) {
                            console.log(status);
                        }
                    }
                }).fail(function (jqXHR, textStatus) {
                    console.log('error: item not deleted ', textStatus);
                }).done(function (msg, status, jqXHR) {
                    M.toast({ html: 'Product Deleted Successfully' });
                });
            }
        });
    });

    deleteServiceIcon.forEach(function (icon) {
        icon.addEventListener('click', function (event) {
            var deleteService = confirm("Are you sure you want to remove this Serivice?");
            if (deleteService === true) {
                $(event.target.parentElement.parentElement).remove();
                $.ajax({
                    url: '/users/removeService',
                    type: 'DELETE',
                    data: {
                        id: event.target.dataset.id
                    },
                    statusCode: {
                        501: function (msg, status, jqXHR) {
                            console.log(status);
                        }
                    }
                }).fail(function (jqXHR, textStatus) {
                    console.log('error: item not deleted ', textStatus);
                }).done(function (msg, status, jqXHR) {
                    M.toast({ html: 'Service Deleted Successfully' });
                });
            }
        });
    });

    function checkChangePasswordInputs () {
        changePasswordForm.oldPassword.addEventListener('keyup', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        changePasswordForm.oldPassword.addEventListener('focusout', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);

        changePasswordForm.newPassword.addEventListener('keyup', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);

        changePasswordForm.newPassword.addEventListener('focusout', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);

        changePasswordForm.confirmPassword.addEventListener('keyup', function (event) {
            if (event.target.value === changePasswordForm.newPassword.value) {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            } else {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            }
        }, false);
    }

    serviceDescription.addEventListener('keyup', function (event) {
        const characters = new String(event.target.value).length;
        serviceDescriptionNumberOfCharacters.innerHTML = characters;
        if (!isEmpty(event.target) || event.target.value.toString().length >= 5) {
            event.target.classList.add('valid');
            event.target.classList.remove('invalid');
        } else {
            event.target.classList.add('invalid');
            event.target.classList.remove('valid');
        }
    });

    itemForm.itemDescription.addEventListener('keyup', function (event) {
        const characters = new String(event.target.value).length;
        itemDescriptionNumberOfCharacters.innerHTML = characters;  
    });

    serviceForm.addEventListener('submit', submitServiceForm);
    $('#addItemForm').submit(function (event) {
        let isOkay = null;
        for (var i = 0; i < saleItems.length; i++) {
            if (isEmpty(saleItems[i])) {
                event.preventDefault();
                saleItems[i].classList.add('invalid');
                saleItems[i].focus();
                M.toast({ html: 'Please complete the form' });
                isOkay = false;
                addItemLoader.style.visibility = 'hidden';
                break;
            } else {
                isOkay = true;
                addItemLoader.style.visibility = 'visible';
            }
        }
    });

    changePasswordForm.addEventListener('submit', submitChangePasswordForm);
    
    removeAccountPassword.addEventListener('focusout', function (event) {
        if (isEmpty(event.target)) {
            event.target.classList.add('invalid');
        } else {
            event.target.classList.remove('invalid');
        }
    });

    removeAccountForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (isEmpty(removeAccountPassword)) {
            removeAccountPassword.classList.add('invalid');
            removeAccountPassword.focus();
        } else {
            removeAccountPassword.classList.remove('invalid');
            removeAccountLoader.style.visibility = 'visible';
            $('#removeAccountButton').html('REMOVING ACCOUNT...');
            $('#removeAccountForm :input').prop('disabled', true);
            $.ajax({
                method: 'DELETE',
                url: `/users/removeUser/${userId}`,
                dataType: 'json',
                data: {
                    id: userId,
                    removeAccountPassword: $('#removeAccountPassword').val()
                },
                statusCode: {
                    401: function (msg, status, jqXHR) {
                        $('#removeAccountForm :input').prop('disabled', false);
                        removeAccountLoader.style.visibility = 'hidden';
                        $('#incorrectRemoveUserPassword').html(msg.responseJSON.message);
                        $('#removeAccountButton').html('REMOVE ACCOUNT');
                        removeAccountPassword.focus();
                    }
                }
            }).done (function (msg) {
                M.toast({ html: msg.message });
                removeAccountLoader.style.visibility = 'hidden';
                $('#removeAccountForm :input').prop('disabled', false);
                $('#removeAccountButton').html('REMOVE ACCOUNT');
                setTimeout(function () {
                    window.location.href = '/';
                }, 3000);
                
            }).fail (function (xhr) {
                console.log('xhr ', xhr);
            });
        }
    });
    cancelButton.addEventListener('click', function (event) {
        event.preventDefault();
        editInputs.forEach(function (input) {
            input.disabled = true;
        });
    });
    editButton.addEventListener('click', function () {
        editInputs.forEach(function (input) {
            input.disabled = false;
        });
        editInputs[0].focus();
    });
    function checkEditInputs () {
        editForm.editFirstName.addEventListener('focusout', function (event) {
            if (isEmpty(event.target)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                M.toast({ html: 'Invalid First Name!' });
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);

        editForm.editLastName.addEventListener('focusout', function (event) {
            if (isEmpty(event.target)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                M.toast({ html: 'Invalid First Name!' });
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        editForm.editEmail.addEventListener('keyup', function (event) {
            if (!emailRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        editForm.editEmail.addEventListener('focusout', function (event) {
            if (!emailRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                M.toast({ html: 'Invalid Email Address!' });
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        editForm.editPassword.addEventListener('keyup', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        editForm.editPassword.addEventListener('focusout', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                M.toast({ html: 'Invalid password!' });
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);

        editForm.editPhone.addEventListener('keyup', function (event) {
            if (!phoneRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);

        editForm.editPhone.addEventListener('focusout', function (event) {
            if (!phoneRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                M.toast({ html: 'Invalid Password!' });
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    }

    saveButton.addEventListener('click', function (event) {
        let isEditFormOkay = null;
        for (var i = 0; i < editInputs.length; i++) {
            if (editInputs[i].disabled === true) {
                M.toast({ html: 'Please click the edit button to update information' });
                break;
            } else if (isEmpty(editInputs[i])) {
                editInputs[i].classList.add('invalid');
                editInputs[i].focus();
                M.toast({ html: 'Form not submitted' });
                isEditFormOkay = false;
                break;
            } else {
                isEditFormOkay = true
            }
        }

        if (isEditFormOkay === true) {
            editDataLoader.style.visibility = 'visible';
            $('#editDataForm :input').prop('disabled', true);
            $.ajax({
                method: 'PUT',
                url: `/users/editUser/${userId}`,
                dataType: 'json',
                data: {
                    firstName: $('#editFirstName').val(),
                    lastName: $('#editLastName').val(),
                    email: $('#editEmail').val(),
                    phone: $('#editPhone').val(),
                    password: $('#editPassword').val()
                },
                statusCode: {
                    401: function (msg, status, jqXHR) {
                        $('#editDataForm :input').prop('disabled', false);
                        editDataLoader.style.visibility = 'hidden';
                        $('#incorrectEditPassword').html(msg.responseJSON.message);
                        editForm.editPassword.focus();
                    }
                }
            }).done (function (msg) {
                M.toast({ html: 'Update Sucessful' });
                editDataLoader.style.visibility = 'hidden';
                let username = document.querySelector('#username');
                username.innerHTML = `${msg.firstName} ${msg.lastName}`;
                setTimeout(function () {
                    $('.modal').modal('close');
                }, 2000);
                
            }).fail (function (xhr) {
                console.log('xhr ', xhr);
            });
        }
    });

    checkEditInputs();
    checkChangePasswordInputs();
});