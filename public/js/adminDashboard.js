$(document).ready(function () {
    $('.tooltipped').tooltip();
    
    const toggleSwitches = document.querySelectorAll('.toggleSwitch');
    const removeUser = document.querySelectorAll('.removeUser');
    const paidMarkers = document.querySelectorAll('.markAsPaid');

    const searchBox = document.getElementById('findUser');

    const showSpinner = () => {
        const spinnerContainer = document.getElementById('preloader-container');
        spinnerContainer.style.display = 'block';
    };

    const hideSpinner = () => {
        const spinnerContainer = document.getElementById('preloader-container');
        spinnerContainer.style.display = 'none';
    };

    const filterUsers = (event) => {
        let filterValue = event.target.value.toUpperCase();
        let tableBody = document.getElementById('tableBody');
        let userRows = tableBody.querySelectorAll('.userRows');

        // let users = document.querySelectorAll('.username');

        userRows.forEach((userRow) => {
            if (userRow.childNodes[1].innerHTML.toUpperCase().indexOf(filterValue) > -1 || userRow.childNodes[3].innerHTML.toUpperCase().indexOf(filterValue) > -1) {
                userRow.style.display = '';
            } else {
                userRow.style.display = 'none'
            }
        });
    };

    toggleSwitches.forEach((toggleSwitch) => {
        let switchState = toggleSwitch.checked;
        toggleSwitch.addEventListener('click', (event) => {
            console.log(event.target.parentElement.parentElement.parentElement.previousElementSibling);
            event.preventDefault();
            const id = event.target.dataset.id;
            let paymentSwitch = event.target;
            const user = paymentSwitch.parentElement.parentElement.parentElement.parentElement.children[1].innerHTML;
            let switchConfirm;

            switch (switchState) {
                case true:
                    switchConfirm = confirm(`Are you Sure you want to disable ${user}?`);
                    if (switchConfirm === true) {
                        const password = prompt("Enter Admin Password");
                        if (password === null || password === '') {
                            toggleSwitch.checked = true;
                        } else {
                            showSpinner();
                            $.ajax({
                                method: 'PUT',
                                url: `/admin/disableUser/${id}`,
                                dataType: 'json',
                                data: {
                                    id,
                                    transactionPassword: password
                                },
                            }).done (function (msg) {
                                hideSpinner();
                                if (msg.message === 'Password Incorrect') {
                                    toggleSwitch.checked = true;
                                    hideSpinner();
                                    M.toast({
                                        html: msg.message,
                                        classes: 'error-message'
                                    });
                                } else {
                                    toggleSwitch.checked = false;
                                    M.toast({ 
                                        html: msg.message,
                                        classes: 'success-message'
                                    });
                                }
                            }).fail (function (xhr) {
                                hideSpinner();
                                toggleSwitch.checked = true;
                                M.toast({ 
                                    html: 'Failed' ,
                                    classes: 'error-message'
                                });
                                console.log('xhr ', xhr);
                            });
                        }
                    } else {
                        toggleSwitch.checked = true;
                    }  
                    break;

                case false:
                    switchConfirm = confirm(`Are you Sure you want to enable ${user}?`);
                    if (switchConfirm === true) {
                        const password = prompt("Enter Admin Password");
                        if (password === null || password === '') {
                            toggleSwitch.checked = false;
                        } else {
                            showSpinner();
                            $.ajax({
                                method: 'PUT',
                                url: `/admin/enableUser/${id}`,
                                dataType: 'json',
                                data: {
                                    id,
                                    transactionPassword: password
                                },
                            }).done (function (msg) {
                                hideSpinner();
                                if (msg.message === 'Password Incorrect') {
                                    toggleSwitch.checked = false;
                                    M.toast({
                                        html: msg.message,
                                        classes: 'error-message',
                                        displayLength: 10000
                                    });
                                    hideSpinner();
                                } else {
                                    toggleSwitch.checked = true;
                                    event.target.parentElement.parentElement.parentElement.previousElementSibling.innerHTML = msg.paidAt;
                                    M.toast({ 
                                        html: msg.message,
                                        classes: 'success-message'
                                    });
                                }
                            }).fail (function (xhr) {
                                hideSpinner();
                                toggleSwitch.checked = false;
                                M.toast({ 
                                    html: 'Failed',
                                    classes: 'error-message'
                                });
                                console.log('xhr ', xhr);
                            });
                        }
                    } else {
                        toggleSwitch.checked = false;
                    }
                    break;
            
                default:
                    break;
            }
        });
    });

    removeUser.forEach((user) => {
        user.addEventListener('click', (event) => {
            const password = prompt("Enter Admin Password to Remove User");
            if (password === null || password === '') {
            } else {
                showSpinner();
                const userId = event.target.dataset.id;
                $.ajax({
                    method: 'DELETE',
                    url: `/admin/removeUserAccount/${userId}`,
                    dataType: 'json',
                    data: {
                        id: userId,
                        password
                    },
                }).done (function (msg) {
                    hideSpinner();
                    if (msg.message === 'Password Incorrect') {
                        M.toast({
                            html: msg.message,
                            classes: 'error-message',
                            displayLength: 10000
                        });
                        hideSpinner();
                    } else {
                        M.toast({ 
                            html: msg.message,
                            classes: 'success-message'
                        });
                        event.target.parentElement.parentElement.remove();
                        setTimeout(() => {
                        window.location.reload();
                        }, 3000);
                    }
                }).fail (function (xhr) {
                    hideSpinner();
                    M.toast({ 
                        html: 'Failed',
                        classes: 'error-message' 
                    });
                    console.log('xhr ', xhr);
                });
            }
        });
    });

    paidMarkers.forEach((paidMarker) => {
        paidMarker.addEventListener('click', (event) => {
            const toggleSwitch = event.target.parentElement.previousElementSibling.firstElementChild.firstElementChild.firstElementChild;
            const user = event.target.parentElement.parentElement.children[1].innerHTML;
            const userId = event.target.dataset.id

            if (toggleSwitch.checked) {
                M.toast({ html: 'User already active.' })
            } else {
                let confirmPayment = confirm(`You sure say ${user} don pay so?`);
                if (confirmPayment === true) {
                    const transactionPassword = prompt("Enter Admin Password");
                    if (transactionPassword === null || transactionPassword === '') {
                    } else {
                        showSpinner();
                        $.ajax({
                            method: 'PUT',
                            url: `/admin/enableUser/${userId}`,
                            dataType: 'json',
                            data: {
                                id: userId,
                                transactionPassword
                            },
                        }).done (function (msg) {
                            hideSpinner();
                            if (msg.message === 'Password Incorrect') {
                                M.toast({
                                    html: msg.message,
                                    classes: 'error-message',
                                    displayLength: 10000
                                });
                                hideSpinner();
                            } else {
                                toggleSwitch.checked = true;    
                                event.target.parentElement.previousElementSibling.previousElementSibling.innerHTML = msg.paidAt;
                                M.toast({ 
                                    html: msg.message,
                                    classes: 'success-message' 
                                });
                            }
                        }).fail (function (xhr) {
                            hideSpinner();
                            M.toast({ 
                                html: 'Failed',
                                classes: 'error-message' 
                            });
                            console.log('xhr ', xhr);
                        });   
                    }
                } 
            }
        });
    });

    searchBox.addEventListener('keyup', filterUsers);
});