$(document).ready(function () {
    $('select').formSelect();
    $('.tooltipped').tooltip({ position: 'top' });

    const homeLink = document.querySelector('.active');
    const accountLink = document.querySelector('.account');

    const serviceForm = document.addServiceForm;
    const itemForm = document.addItemForm;

    const serviceLoader = document.querySelector('#addServiceLoader');
    const itemLoader = document.querySelector('#addItemLoader');

    const serviceCategory = serviceForm.seviceCategory;
    const serviceDescription = serviceForm.serviceDescription;

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
});