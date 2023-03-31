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

/* BOTON PARA PASAR A SEGUNDA TARJETA EN MODAL DE PAGO CON DOS TARJETAS */
document.querySelector("#switchTarjeta2").addEventListener("click", function () {
    var selectTab2 = document.querySelector('#tab-tarjeta2');
    var tab2 = new bootstrap.Tab(selectTab2);
    tab2.show();
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

            // Hacer focus automaticamente en el primer input (por el momento desactivado)
            if (!/Mobi/.test(navigator.userAgent)) {
                const firstInput = targetForm.querySelector('form input[name="cardNumber"]');
                firstInput.focus();
            } else {
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


window.addEventListener('scroll', function () {
    var sidebar = document.querySelector('.checkout-details');
    var sidebarPosition = sidebar.getBoundingClientRect().top + window.pageYOffset;
    if (window.pageYOffset > sidebarPosition) {
        sidebar.classList.add('fijar');
    } else {
        sidebar.classList.remove('fijar');
    }
});




/* function addClassIfKeyboardVisible() {
    const sidebar = document.getElementById('sidebar');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    document.addEventListener('focusin', () => {
      if (isMobile && document.activeElement.nodeName === 'INPUT') {
        setTimeout(() => {
          const newViewportHeight = window.innerHeight;
          if (viewportHeight > newViewportHeight) {
            sidebar.classList.add('toggleDown');
          }
          viewportHeight = newViewportHeight;
        }, 100);
      }
    });
    
    document.addEventListener('focusout', () => {
      sidebar.classList.remove('toggleDown');
    });
  }
  

  function adjustStickyElementForMobile() {
    const stickyElement = document.getElementById('sidebar');
    let originalPosition;
    let originalOffsetTop;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
    // Save the original position and offset of the sticky element
    originalPosition = stickyElement.style.position;
    originalOffsetTop = stickyElement.offsetTop;
  
    // Listen for the resize event to detect when the keyboard is visible
    window.addEventListener('resize', () => {
      const newViewportHeight = window.innerHeight;
      if (isMobile && viewportHeight > newViewportHeight) {
        // Keyboard is visible, adjust the position of the sticky element
        stickyElement.style.position = 'fixed';
        stickyElement.style.top = '0';
      } else {
        // Keyboard is hidden, reset the position of the sticky element
        stickyElement.style.position = originalPosition;
        stickyElement.style.top = originalOffsetTop + 'px';
      }
      viewportHeight = newViewportHeight;
    });
  } */