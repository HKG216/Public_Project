// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
ShowModal = (url, title) => {

    $.ajax({
        type: "GET",
        url: url,
        success: function (res) {
            if (res != false) {
                $("#form-modal .modal-body").html(res);
                $('#form-modal .modal-title').html(title);
                $("#form-modal").modal('show');
            }
            else {
                toastr.warning('This Patient have Reservations')
            }

        },
        failure: function (response) {
            alert(response.responseText)
        }, error: function (response) {
            alert(response.responseText)
        }

    })
}