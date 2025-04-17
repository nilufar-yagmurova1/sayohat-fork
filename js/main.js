// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Flight search form handling
    const flightSearchForm = document.getElementById('flight-search-form');
    if (flightSearchForm) {
        flightSearchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const departure = document.getElementById('departure').value;
            const destination = document.getElementById('destination').value;
            const departureDate = document.getElementById('departure-date').value;
            const returnDate = document.getElementById('return-date').value;
            const passengers = document.getElementById('passengers').value;
            
            // Validate form
            if (!departure || !destination || !departureDate || !passengers) {
                showAlert('Илтимос, барча майдонларни тўлдиринг', 'danger');
                return false;
            }
            
            // Check that departure and destination are not the same
            if (departure === destination) {
                showAlert('Жўнатиш ва мақсад жойлари бир хил бўлиши мумкин эмас', 'danger');
                return false;
            }
            
            // Check that departure date is not in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const depDate = new Date(departureDate);
            
            if (depDate < today) {
                showAlert('Жўнаб кетиш санаси бугундан олдин бўлиши мумкин эмас', 'danger');
                return false;
            }
            
            // If return date is provided, check that it's after departure date
            if (returnDate) {
                const retDate = new Date(returnDate);
                if (retDate < depDate) {
                    showAlert('Қайтиш санаси жўнаб кетиш санасидан кейин бўлиши керак', 'danger');
                    return false;
                }
            }
            
            // If all validations pass, redirect to flights page with search parameters
            const searchParams = new URLSearchParams({
                departure: departure,
                destination: destination,
                departureDate: departureDate,
                returnDate: returnDate || '',
                passengers: passengers
            });
            
            window.location.href = 'flights.html?' + searchParams.toString();
        });
    }
    
    // Flight booking form handling
    const bookFlightForm = document.getElementById('book-flight-form');
    if (bookFlightForm) {
        bookFlightForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get passenger details
            const passengerForms = document.querySelectorAll('.passenger-form');
            const passengers = [];
            
            passengerForms.forEach(function(form, index) {
                const firstName = form.querySelector('.passenger-first-name').value;
                const lastName = form.querySelector('.passenger-last-name').value;
                const passport = form.querySelector('.passenger-passport').value;
                const birthdate = form.querySelector('.passenger-birthdate').value;
                
                // Validate passenger details
                if (!firstName || !lastName || !passport || !birthdate) {
                    showAlert(`Илтимос, ${index + 1}-йўловчи учун барча майдонларни тўлдиринг`, 'danger');
                    return false;
                }
                
                passengers.push({
                    firstName: firstName,
                    lastName: lastName,
                    passport: passport,
                    birthdate: birthdate
                });
            });
            
            // Get payment details
            const cardNumber = document.getElementById('card-number').value;
            const cardName = document.getElementById('card-name').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            
            // Validate payment details
            if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                showAlert('Илтимос, тўлов маълумотларини тўлдиринг', 'danger');
                return false;
            }
            
            // Simulate processing payment and booking
            showLoader();
            
            // Simulate API call with setTimeout
            setTimeout(function() {
                hideLoader();
                
                // Get flight details from URL params
                const urlParams = new URLSearchParams(window.location.search);
                const flightId = urlParams.get('flightId');
                
                // Simulate successful booking
                localStorage.setItem('lastBookingId', 'BK' + Math.floor(Math.random() * 1000000));
                
                // Show success message and redirect to confirmation page
                showAlert('Бронлаш муваффақиятли якунланди!', 'success');
                setTimeout(function() {
                    window.location.href = 'booking-confirmation.html?bookingId=' + localStorage.getItem('lastBookingId');
                }, 1500);
            }, 2000);
        });
    }
    
    // Cancel ticket handling
    const cancelTicketBtns = document.querySelectorAll('.cancel-ticket-btn');
    if (cancelTicketBtns.length > 0) {
        cancelTicketBtns.forEach(function(btn) {
            btn.addEventListener('click', function(event) {
                event.preventDefault();
                
                const ticketId = this.getAttribute('data-ticket-id');
                
                if (confirm('Ҳақиқатан ҳам чиптани бекор қилмоқчимисиз?')) {
                    // Simulate cancellation process
                    showLoader();
                    
                    setTimeout(function() {
                        hideLoader();
                        showAlert('Чипта муваффақиятли бекор қилинди. Пулингиз 3-5 кун ичида қайтарилади.', 'success');
                        
                        // Remove the ticket card from DOM
                        const ticketCard = document.querySelector(`.ticket-card[data-ticket-id="${ticketId}"]`);
                        if (ticketCard) {
                            ticketCard.remove();
                        }
                        
                        // If no tickets left, show message
                        const remainingTickets = document.querySelectorAll('.ticket-card');
                        if (remainingTickets.length === 0) {
                            const ticketsContainer = document.querySelector('.tickets-container');
                            if (ticketsContainer) {
                                ticketsContainer.innerHTML = '<div class="alert alert-info">Сизда ҳозирда чипталар мавжуд эмас.</div>';
                            }
                        }
                    }, 1500);
                }
            });
        });
    }
    
    // Change ticket handling
    const changeTicketBtns = document.querySelectorAll('.change-ticket-btn');
    if (changeTicketBtns.length > 0) {
        changeTicketBtns.forEach(function(btn) {
            btn.addEventListener('click', function(event) {
                event.preventDefault();
                
                const ticketId = this.getAttribute('data-ticket-id');
                const modal = new bootstrap.Modal(document.getElementById('changeTicketModal'));
                
                // Set ticket ID in the modal
                document.getElementById('change-ticket-id').value = ticketId;
                
                // Show the modal
                modal.show();
            });
        });
    }
    
    // Change ticket form handling
    const changeTicketForm = document.getElementById('change-ticket-form');
    if (changeTicketForm) {
        changeTicketForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const ticketId = document.getElementById('change-ticket-id').value;
            const newDate = document.getElementById('new-flight-date').value;
            
            // Validate new date
            if (!newDate) {
                showAlert('Илтимос, янги учиш санасини танланг', 'danger');
                return false;
            }
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(newDate);
            
            if (selectedDate < today) {
                showAlert('Сана бугундан олдин бўлиши мумкин эмас', 'danger');
                return false;
            }
            
            // Simulate change process
            showLoader();
            
            setTimeout(function() {
                hideLoader();
                
                // Hide modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('changeTicketModal'));
                modal.hide();
                
                showAlert('Чипта муваффақиятли ўзгартирилди. Янги чипта маълумотлари почтангизга юборилди.', 'success');
                
                // Update ticket date in DOM
                const ticketDateElement = document.querySelector(`.ticket-card[data-ticket-id="${ticketId}"] .ticket-date`);
                if (ticketDateElement) {
                    // Format date for display
                    const formattedDate = new Date(newDate).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    ticketDateElement.textContent = formattedDate;
                }
            }, 1500);
        });
    }
    
    // Initialize country filters on countries page
    const countryFilterBtns = document.querySelectorAll('.country-filter-btn');
    if (countryFilterBtns.length > 0) {
        countryFilterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                countryFilterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                const countryCards = document.querySelectorAll('.country-card');
                
                countryCards.forEach(function(card) {
                    const continent = card.getAttribute('data-continent');
                    
                    if (filter === 'all' || filter === continent) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Helper function to show alerts
    function showAlert(message, type) {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Find alert container
        let alertContainer = document.querySelector('.alert-container');
        
        // If container doesn't exist, create it
        if (!alertContainer) {
            alertContainer = document.createElement('div');
            alertContainer.className = 'alert-container position-fixed top-0 start-50 translate-middle-x p-3';
            alertContainer.style.zIndex = '1050';
            document.body.appendChild(alertContainer);
        }
        
        // Add alert to container
        alertContainer.appendChild(alertDiv);
        
        // Auto-dismiss after 5 seconds
        setTimeout(function() {
            if (alertDiv.parentNode) {
                const bsAlert = new bootstrap.Alert(alertDiv);
                bsAlert.close();
            }
        }, 5000);
    }
    
    // Helper functions for showing/hiding loader
    function showLoader() {
        let loader = document.querySelector('.loader-overlay');
        
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'loader-overlay';
            loader.innerHTML = `
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Юкланмоқда...</span>
                </div>
            `;
            document.body.appendChild(loader);
        }
        
        loader.style.display = 'flex';
    }
    
    function hideLoader() {
        const loader = document.querySelector('.loader-overlay');
        if (loader) {
            loader.style.display = 'none';
        }
    }
    
    // Add animation to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.card, .feature-card, .testimonial-card');
        
        elements.forEach(function(element) {
            const elementPosition = element.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            
            if (elementPosition < screenHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    };
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger once on page load
    animateOnScroll();
}); 