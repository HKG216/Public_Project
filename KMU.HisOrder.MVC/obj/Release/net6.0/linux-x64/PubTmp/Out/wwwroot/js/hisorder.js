$(document).ready(function () {

    //modal show
    var defalutShow = $("#switchClinic_modal").attr("data-showModal");

    console.log(defalutShow);

    if (defalutShow == "True") {
        $("#switchClinic_modal").modal('show');
    }

    $('input[name="clinic-date"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
            format: 'YYYY/MM/DD'
        }
    });

    $('input[name="clinic-date"]').on('apply.daterangepicker', function (ev, picker) {
        console.log(picker.startDate.format('YYYY-MM-DD'));
        console.log(picker.endDate.format('YYYY-MM-DD'));

        var clinicDate = picker.startDate.format('YYYY/MM/DD');
        var clinicDoctorCode = $('input[name="clinic-doctor-code"]').attr('data-clinic-doctor-code');
        var vURL = "/HisOrder/Ajax/GetClinicScheList"
        var vData = {
            inDoctorCode: clinicDoctorCode,
            inRegDate: clinicDate
        }

        console.log(clinicDate);
        console.log(clinicDoctorCode);


        var vSuccessFunc = function (msg) {
            var objResult = JSON.parse(msg);
            if (objResult.isSuccess === true) {
                console.log("successssss");

                var ClinicScheList = JSON.parse(objResult.returnValue);
                //版面更新
                $("#switch_dept_card").find('.row:first').empty();
                if (ClinicScheList.length > 0) {

                    $.each(ClinicScheList, function (i, val) {
                        var $el = $(".clinic_dept_box_templete")
                            .clone(true, true)
                            .removeClass('clinic_dept_box_templete')
                            .attr('hidden', false)

                        $el.find('.clinic_dept_box')
                            .attr('data-dept-code', val.SCHE_DPT)
                            .attr('data-room-no', val.SCHE_ROOM)

                            .attr('data-doctor-code', val.SCHE_DOCTOR_CODE)
                            .attr('data-login-code', val.SCHE_DOCTOR_CODE)

                        $el.find('.clinic_dept_title').text(val.SCHE_DPT_NAME)
                        $el.find('.clinic_dept_room').text(val.SCHE_ROOM)
                        $el.find('.clinic_doctor_name').text(val.SCHE_DOCTOR_NAME)

                        $("#switch_dept_card")
                            .find('.row:first')
                            .append($el);
                    });
                }
            } else {
                $("#switch_dept_card").find('.row:first').empty();
            }

        }

        var vErrorFunc = function () {
            fullscreenLoading(false);
            layer.msg("GetClinicScheList失敗");
        };

        ajax(vURL, vData, vSuccessFunc, vErrorFunc);
    });



    $("#patientlist_tb").DataTable({});
    $('#page_content').css('min-height', '100vh');



    $(".clinic_dept_box").click(function () {

        $("#switch_dept_card")
            .find(".ok")
            .removeClass("ok");
        $(this).addClass("ok");
    });

    $(".pt-call-btn").click(function () {
        var vInhospid = $(this).closest('tr').attr('data-inhospid');
        var vURL = "/HisOrder/Ajax/callLight";
        var vData = {
            inhospid: vInhospid
        };

        var vSuccessFunc = function (msg) {
            var objResult = JSON.parse(msg);
            if (objResult.isSuccess == true) {
                layer.msg(objResult.Message);
                //var roomNub = $()
                var regData = JSON.parse(objResult.returnValue);
                connection.invoke("SendMessage", regData.RegRoomNo, regData.RegSeqNo.toString()).catch(function (err) {
                    alert('傳送錯誤: ' + err.toString());
                });

            }
            else {
                layer.msg("叫號失敗" + objResult.Message);
            }
        };
        var vErrorFunc = function () {
            layer.msg("叫號失敗");
        };

        ajax(vURL, vData, vSuccessFunc, vErrorFunc);
    });


    $("#checkbox_opd").change(function () {
        console.log('checkbox_opd');
        var n = $("input:checked").length;
        console.log(n);
        if (n > 0) {
            console.log('n > 0');
            $("#switch_dept_card").attr("hidden", false);

            console.log('hidden');
        }
    });


    var switchPatientFunc = function () {
        fullscreenLoading(true);

        $('#patientInhospid').val($(this).data('inhospid'));
        $('#patientPatientid').val($(this).data('patient-id'));
        $('#patientVisitStatus').val($(this).data('visit-status'));


        if ($('body').hasClass('nav-sm')) {
            $('#htmlBody').val('nav-sm');
        } else {
            $('#htmlBody').val('nav-md');
        }

        $('#patient-list-form').submit();
    };

    $('tr.clickable-patient').dblclick(function () {
        switchPatientFunc.call(this);
    });



    //切換診間
    var switchClinicFunc = function () {
        fullscreenLoading(true);

        var box = $(".clinic_dept_box.ok");
        var dept_code = box.attr('data-dept-code');
        var room_no = box.attr('data-room-no');

        $('#clinicDate').val($('input[name="clinic-date"]').val());
        $('#clinicDeptCode').val(dept_code);
        $('#clinicRoomNo').val(room_no);

        $('#switchClinic-modal-form').submit();
    };

    $('.switch_confirm').click(function () {
        switchClinicFunc.call(this);
    });

});
