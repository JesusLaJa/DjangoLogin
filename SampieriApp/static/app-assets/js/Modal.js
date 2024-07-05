var Modal = (function (Swal) {
    /**
     * id, title, content, cssClass
     * @param object config
     * @returns object (jquery)
     */
    function createModal(config) {
        config.hideHeader = (config.hideHeader ? config.hideHeader : false);
        config.hideFooter = (config.hideFooter ? config.hideFooter : false);
        config.modalNotCentered = (config.modalNotCentered ? config.modalNotCentered : false);

        $('body').append(
                '<div id="' + config.id + '" class="modal fade text-left" tabindex="-1" role="dialog" aria-labelledby="myModalLabel160" aria-hidden="true">' +
                '<div class="modal-dialog ' + (!config.modalNotCentered ? 'modal-dialog-centered' : '') + ' modal-dialog-scrollable ' + (config.sizeClass || '') + '" role="document">' +
                '<div class="modal-content">' +
                (!config.hideHeader ?
                        '<div id="idModal" class="modal-header bg-primary">' +
                        '<h5 class="modal-title white" id="myModalLabel160">' + (config.title || '') + '</h5>' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                        '<i class="bx bx-x"></i>' +
                        '</button>' +
                        '</div>'
                        : ''
                        ) +
                '<div class="modal-body">' +
                (config.content || '') +
                '</div>' +
                (!config.hideFooter
                        ? (config.contentFooter ||
                                '<div class="modal-footer">' +
                                '<button type="button" id="cancelModal" class="btn btn-light-secondary" data-dismiss="modal">' +
                                '<i class="bx bx-x d-block d-sm-none"></i>' +
                                '<span class="d-none d-sm-block">' + (config.cancelButtonText || 'Cerrar') + '</span>' +
                                '</button>' +
                                '<button id="okModal" class="btn ' + (config.okButtonClass || 'btn-primary') + ' ml-1">' +
                                '<i class="bx bx-check d-block d-sm-none"></i>' +
                                '<span class="d-none d-sm-block">' + (config.okButtonText || 'Guardar') + '</span>' +
                                '</button>' +
                                '</div>')
                        : ''
                        ) +
                '</div>' +
                '</div>' +
                '</div>'
                );

        return $('#' + config.id);
    }

    return {
        loading: {
            open: function () {
                $.blockUI({
                    message: '<div class="bx bx-revision icon-spin font-medium-2"></div>',
                    overlayCSS: {
                        backgroundColor: '#fff',
                        opacity: 0.8,
                        cursor: 'wait'
                    },
                    css: {
                        border: 0,
                        padding: 0,
                        backgroundColor: 'transparent'
                    }
                });
            }
            , close: function () {
                $.unblockUI();
            }
        }
        , alert: {
            error: function (title, content, functionConfirm) {
                Swal.fire({
                    title: title || 'Error en el procesamiento'
                    , text: content || ''
                    , type: 'error'
                    , animation: false
                }).then(function (result) {
                    if (result.value && functionConfirm) {
                        functionConfirm();
                    }
                });
            }
            , success: function (title, content, functionConfirm) {
                Swal.fire({
                    title: title || "Procesamiento exitoso"
                    , text: content || ''
                    , type: 'success'
                    , animation: false
                }).then(function (result) {
                    if (result.value && functionConfirm) {
                        functionConfirm();
                    }
                });
            }
            , confirm: function (title, content, functionConfirm, cancelButton,  confirmButton) {
                Swal.fire({
                    title: title || '¿Está seguro de inactivar el registro?'
                    , text: content || ''
                    , type: 'warning'
                    , showCancelButton: true
                    , cancelButtonText: cancelButton || 'Cerrar'
                    , confirmButtonColor: '#0783e8'
                    , confirmButtonText: confirmButton || 'Aceptar'
                    , animation: false
                }).then(function (result) {
                    if (result.value && functionConfirm) {
                        functionConfirm();
                    }
                });
            }
             , info: function (title, content, functionConfirm, cancelButton,  confirmButton, showCancelButton) {
                Swal.fire({
                    title: title || '¿Está seguro de inactivar el registro?'
                    , text: content || ''
                    , type: 'info'
                    , showCancelButton: showCancelButton || false
                    , confirmButtonColor: '#0783e8'
                    , confirmButtonText: confirmButton || 'Aceptar'
                    , animation: false
                }).then(function (result) {
                    if (result.value && functionConfirm) {
                        functionConfirm();
                    }
                });
            }
            
        }
        , create: function (config) {
            var modal = $('#' + config.id);
            if (modal.length > 0) {
                modal.remove();
            }
            modal = createModal(config);

            config.show = (config.show ? config.show : false);
            modal.modal(config);
            modal.on('hidden.bs.modal', function () {
                modal.remove();
            });
            modal.css({
                overflow: 'auto'
            });
            return modal;
        }
        , close: function (id) {
            var modal = $('#' + id);
            modal.modal('hide');
        }
    };
})(Swal);