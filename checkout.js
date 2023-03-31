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


/* ----- SELECTORES ----- */

/* SELECTORS */
const cardFormsContainer = document.getElementById('creditCardFormContainer');
const cardForms = document.querySelectorAll('.form-tarjeta');
const forms = document.querySelectorAll('.form-tarjeta form');
const paymentRadios = document.querySelectorAll('input[name="paymentSelector"]');
const payButton = document.querySelector('#btnPay');
const expMonthInputs = document.querySelectorAll('input[name="expMonth"]');
const expYearInputs = document.querySelectorAll('input[name="expYear"]');
const closeBtns = document.querySelectorAll('.modal-close');
const modalTarjetas = document.querySelectorAll('.modal-tarjeta');
const switchTarjeta2Btn = document.querySelector("#switchTarjeta2");



/* ----- FUNCIONES ----- */

/* BOTON PARA PASAR A LA OTRA TARJETA EN MODAL DE PAGO CON DOS TARJETAS */
document.querySelector("#switchTarjeta2").addEventListener("click", function () {
    var selectTab2 = document.querySelector('#tab-tarjeta2');
    var tab2 = new bootstrap.Tab(selectTab2);
    tab2.show();
});
document.querySelector("#switchTarjeta1").addEventListener("click", function () {
    var selectTab1 = document.querySelector('#tabTarjeta1-tab');
    var tab1 = new bootstrap.Tab(selectTab1);
    tab1.show();
});

/* ACTIVAR BOTONES SI LOS INPUTS ESTÁN COMPLETOS */
/* Habria que agregarle alguna validacion para que ademas verifique que esten completados correctamente los inputs (hasta ahora solo verifica que estén tengan algun contenido) */

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



/* LIMITAR INPUTS DE MES Y AÑO Y AL COMPLETAR EL MES PASAR A AÑO DIRECTAMENTE */

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




/* MOSTRAR EL FORMULARIO DE UNA / DOS TARJETAS Y OCULTAR SI SE SELECCIONA OTRA OPCION DE PAGO */
paymentRadios.forEach(radio => {
    radio.addEventListener('change', function () {

        // Si se selecciona pagar con tarjeta mostrar el form respectivo y desactivar / mantener desactivado el boton de Pagar
        if (this.classList.contains('input-seleccionar-tarjeta')) {
            const targetId = this.getAttribute('data-target');
            const targetForm = document.querySelector(`.form-tarjeta.${targetId}`);
            cardForms.forEach(form => {
                form.style.display = 'none';
            });
            targetForm.style.display = 'block';
            document.getElementById('btnPay').disabled = true;

            // Hacer focus automaticamente en el primer input en desktop
            if (!/Mobi/.test(navigator.userAgent)) {
                const firstInput = targetForm.querySelector('form input[name="cardNumber"]');
                firstInput.focus();
            }
            // En mobile solo hacer scroll para que se vea
            else {
                cardFormsContainer.scrollIntoView({
                    behavior: 'smooth'
                });
            }


            // Si se selecciona otro medio de pago ocultar el form de tarjeta y activar el boton de Pagar
        } else {
            cardForms.forEach(form => {
                form.style.display = 'none';
            });
            payButton.disabled = false;
            payButton.classList.remove('disabled-pay');
        }

        // Si es el boton de Rapipago cambiar el Boton a Confirmar
        if (this.id == 'paymentRapipago') {
            payButton.textContent = "Confirmar";
        }
        // para los demas
        else {
            payButton.textContent = "Pagar";
        }

        // Vaciar los inputs del form de tarjeta
        document.querySelectorAll('.form-tarjeta input, .form-tarjeta textarea').forEach((field) => {
            field.value = '';
            field.dispatchEvent(new Event('keyup'));
        });
        // Volver el grafico de la tarjeta a gris
        document.querySelectorAll('.bqb-card').forEach((bqbCard) => {
            bqbCard.classList.remove('bqb-card-unknown');
        });
    });
});

/* AGREGAR UNA CLASE AL DETALLE DE PAGO PARA QUE AL HACER SCROLL SE FIJE EL BOTON DE PAGAR EN DESKTOP */
window.addEventListener('scroll', function () {
    var sidebar = document.querySelector('.checkout-details');
    var sidebarPosition = sidebar.getBoundingClientRect().top + window.pageYOffset;
    if (window.pageYOffset > sidebarPosition) {
        sidebar.classList.add('fijar');
    } else {
        sidebar.classList.remove('fijar');
    }
});