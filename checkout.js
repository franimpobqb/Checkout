/* INICIAR GRÁFICOS DE TARJETAS / UNO POR TARJETA */
var c0 = new Card({
    form: document.querySelector('.form-0'),
    container: '.card-wrapper-0',
    formSelectors: {
        expiryInput: ['input[name="expMonth"]', 'input[name="expYear"]']
    }
});
var c1 = new Card({
    form: document.querySelector('.form-1'),
    container: '.card-wrapper-1',
    formSelectors: {
        expiryInput: ['input[name="expMonth"]', 'input[name="expYear"]']
    }
});
var c2 = new Card({
    form: document.querySelector('.form-2'),
    container: '.card-wrapper-2',
    formSelectors: {
        expiryInput: ['input[name="expMonth"]', 'input[name="expYear"]']
    }
});

/* BOTON PARA PASAR A SEGUNDA TARJETA EN MODAL DE PAGO CON DOS TARJETAS */
document.querySelector("#switchTarjeta2").addEventListener("click", function () {
    var selectTab2 = document.querySelector('#tab-tarjeta2');
    var tab2 = new bootstrap.Tab(selectTab2);
    tab2.show();
});

/* ACTIVAR BOTONES SI LOS INPUTS ESTÁN COMPLETOS */
/* Habria que agregarle alguna validacion para que ademas verifique que esten completados correctamente los inputs (hasta ahora solo verifica que estén tengan algun contenido) */
const forms = document.querySelectorAll('form');

forms.forEach((form) => {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.querySelectorAll('input[required]').forEach((input) => {
        input.addEventListener('input', () => {

            const allInputsFilled = Array.from(form.querySelectorAll('input[required]'))
                .every((input) => {
                    return input.checkValidity();
                });

            submitBtn.disabled = !allInputsFilled;

            const prevForm = form.previousElementSibling;
            const nextForm = form.nextElementSibling;

            if (prevForm && prevForm.querySelectorAll('input[required]:not(:valid)')
                .length > 0) {
                prevForm.querySelector('button[type="submit"]').disabled = true;
            } else if (prevForm) {
                prevForm.querySelector('button[type="submit"]').disabled = false;
            }

            if (nextForm && nextForm.querySelectorAll('input[required]:not(:valid)')
                .length > 0) {
                nextForm.querySelector('button[type="submit"]').disabled = true;
            } else if (nextForm) {
                nextForm.querySelector('button[type="submit"]').disabled = false;
            }
        });
    });
});

/* LIMPIAR INPUTS AL CERRAR EL MODAL */
const closeBtns = document.querySelectorAll('.modal-close');
closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.modal');

        modal.querySelectorAll('input, textarea').forEach((field) => {
            field.value = '';
            field.dispatchEvent(new Event('keyup'));
        });

        // Sacar el grafico de la tarjeta
        modal.querySelector('.bqb-card').classList.remove('bqb-card-unknown');
    });
});

/* ACTIVAR BOTÓN DE PAGO SI SE SELECCIONA UN MEDIO DE PAGO (OTROS) */
const otherPaymentRadios = document.querySelectorAll('input[name="otherPaymentSelector"]');
const payButton = document.querySelector('#btnPay');

otherPaymentRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        const anyChecked = Array.from(otherPaymentRadios).some((otherRadio) => otherRadio
            .checked);
        if (anyChecked) {
            //Si es rapipago
            if (radio.id == 'otherPaymentRapipago') {
                payButton.textContent = "Confirmar";
            }
            // para los demas
            else {
                payButton.textContent = "Pagar";
            }
            //para todos
            payButton.classList.remove('disabled-pay');
        }
    });
});

/* LIMITAR INPUTS DE MES Y AÑO Y AL COMPLETAR EL MES PASAR A AÑO DIRECTAMENTE */
const expMonthInputs = document.querySelectorAll('input[name="expMonth"]');
const expYearInputs = document.querySelectorAll('input[name="expYear"]');
expYearInputs.forEach((inputYear) => {
    inputYear.addEventListener('input', () => {
        let inputYearValue = inputYear.value;
        // Limitar a dos caracteres
        inputYearValue = inputYearValue.slice(0, 2);
        inputYear.value = inputYearValue;

    });
});

expMonthInputs.forEach((inputMonth) => {
    inputMonth.addEventListener('input', () => {

        let inputMonthValue = inputMonth.value;
        // Limitar a dos caracteres
        inputMonthValue = inputMonthValue.slice(0, 2);
        inputMonth.value = inputMonthValue;

        // Si se completan los dos caracteres pasar al siguiente.
        if (inputMonthValue.length === 2) {
            inputMonth.nextElementSibling.focus();
        }
    });
});

/* SELECCIONAR EL PRIMER INPUT AUTOMATICAMENTE AL ABRIR EL MODAL */

const modalTarjetas = document.querySelectorAll('.modal-tarjeta');


modalTarjetas.forEach((modal) => {
    const firstInput = modal.querySelector('form input[name="cardNumber"]');
    modal.addEventListener('shown.bs.modal', () => {
        firstInput.focus();
    });
});