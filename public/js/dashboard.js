$(document).ready(function () {
    $('select').formSelect();
    $('.tooltipped').tooltip({ position: 'top' });

    const homeLink = document.querySelector('.active');
    const accountLink = document.querySelector('.account');

    const serviceForm = document.addServiceForm;
    const itemForm = document.addItemForm;
    const editForm = document.editDataForm;
    const removeAccountForm = document.removeAccountForm;

    const serviceLoader = document.querySelector('#addServiceLoader');
    const itemLoader = document.querySelector('#addItemLoader');
    const removeAccountLoader = document.querySelector('#removeAccountLoader');
    const editDataLoader = document.querySelector('#editDataLoader');

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

    const itemName = itemForm.itemName;
    const itemPrice = itemForm.itemPrice;
    const itemCategory = itemForm.itemCategory;
    const itemDescription = itemForm.itemDescription;
    const itemImage = itemForm.fileField;

    const saleItems = [
        itemForm.itemName,
        itemForm.itemPrice,
        itemForm.itemCategory,
        itemForm.itemDescription,
        itemForm.fileField
    ];

    const removeAccountPassword = removeAccountForm.removeAccountPassword;
    const userId = document.getElementById('username').getAttribute('data-id');

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
                    user: $('#username').html().toUpperCase()
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
                const tableBody = document.getElementById('tbody');

                const tableDataName = document.createElement('td');
                const tableDataCategory = document.createElement('td');
                const tableDataPrice = document.createElement('td');
                const tableDataStatus = document.createElement('td');
                const tableDataAction = document.createElement('td');

                const deleteIcon = document.createElement('span');
                const checkIcon = document.createElement('span');

                deleteIcon.setAttribute('class', 'mdi mdi-delete-outline table-icon tooltipped');
                deleteIcon.setAttribute('data-tooltip', 'Remove Item');

                const serviceName = document.createTextNode(msg.category);
                tableDataName.appendChild(serviceName);

                const serviceCategory = document.createTextNode('Service');
                tableDataCategory.appendChild(serviceCategory);

                const servicePrice = document.createTextNode('');
                tableDataPrice.appendChild(servicePrice);

                const serviceStatus = document.createTextNode('Available');
                tableDataStatus.appendChild(serviceStatus);

                tableDataAction.appendChild(deleteIcon);

                tableRow.appendChild(tableDataName);
                tableRow.appendChild(tableDataCategory);
                tableRow.appendChild(tableDataPrice);
                tableRow.appendChild(tableDataStatus);
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

    // function submitItemForm (event) {
    //     event.preventDefault();
    //     let isOkay = null;
    //     for (var i = 0; i < saleItems.length; i++) {
    //         if (isEmpty(saleItems[i])) {
    //             saleItems[i].classList.add('invalid');
    //             saleItems[i].focus();
    //             M.toast({ html: 'Please complete the form' });
    //             isOkay = false;
    //             break;
    //         } else {
    //             isOkay = true;
    //         }
    //     }

    //     if (isOkay === true) {
    //         serviceLoader.style.visibility = 'visible';
    //         $('#addItemButton').html('UPLOADING...');
    //         $('#addItemForm :input').prop('disabled', true);
    //         $(event.target).ajaxSubmit({
    //             fail: function (xhr) {
    //                 status('Error ' + xhr.status);
    //             },
    //             success: function (response) {
    //                 console.log(response);
    //             }
    //         });
    //         M.toast({ html: 'File Uploaded Successfully!' });
    //         return false;
    //     }
    // }

    serviceDescription.addEventListener('keyup', function (event) {
        if (!isEmpty(event.target) || event.target.value.toString().length >= 5) {
            event.target.classList.add('valid');
            event.target.classList.remove('invalid');
        } else {
            event.target.classList.add('invalid');
            event.target.classList.remove('valid');
        }
    });

    homeLink.classList.remove('active');
    accountLink.classList.add('active');

    serviceForm.addEventListener('submit', submitServiceForm);
    $('#addItemForm').submit(function (event) {
        // event.preventDefault();
        let isOkay = null;
        for (var i = 0; i < saleItems.length; i++) {
            if (isEmpty(saleItems[i])) {
                event.preventDefault();
                saleItems[i].classList.add('invalid');
                saleItems[i].focus();
                M.toast({ html: 'Please complete the form' });
                isOkay = false;
                break;
            } else {
                isOkay = true;
            }
        }

        // if (isOkay === true) {
        //     itemLoader.style.visibility = 'visible';
        //     $('#addItemButton').html('UPLOADING...');
        //     $('#addItemForm :input').prop('disabled', true);
        //     const form = document.getElementById('addItemForm');
        //     let formData = new FormData(form);
        //     const data = {
        //         image: itemImage.value,
        //         name: itemName.value,
        //         price: itemPrice.value,
        //         user: $('#username').html().toUpperCase(),
        //         category: itemCategory.value
        //     }
        //     $.ajax({
        //         url: event.target.attributes[4].nodeValue,
        //         data: formData,
        //         type: 'POST',
        //         // dataType: 'json',
        //         processData: false,
        //         // contentType: false,
        //         enctype: 'multipart/form-data',
        //         cache: false,
        //         fail: function (xhr) {
        //             itemLoader.style.visibility = 'hidden';
        //             $('#addItemButton').html('ADD ITEM');
        //             $('#addItemForm :input').prop('disabled', false);
        //             status('Error ' + xhr.status);
        //         },
        //         success: function (response) {
        //             itemLoader.style.visibility = 'hidden';
        //             $('#addItemButton').html('ADD ITEM');
        //             $('#addItemForm :input').prop('disabled', false);
        //             console.log(response);
        //             M.toast({ html: 'File Uploaded Successfully!' });
        //         }
        //     });
            // $(this).ajaxSubmit({
            //     fail: function (xhr) {
            //         itemLoader.style.visibility = 'hidden';
            //         $('#addItemButton').html('ADD ITEM');
            //         $('#addItemForm :input').prop('disabled', false);
            //         status('Error ' + xhr.status);
            //     },
            //     success: function (response) {
            //         itemLoader.style.visibility = 'hidden';
            //         $('#addItemButton').html('ADD ITEM');
            //         $('#addItemForm :input').prop('disabled', false);
            //         console.log(response);
            //         M.toast({ html: 'File Uploaded Successfully!' });
            //     }
            // });
            // return false;
        //}
    });
    // itemForm.addEventListener('submit', submitItemForm);
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
    cancelButton.addEventListener('click', function () {
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
                url: `/users/removeUser/${userId}`,
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
});