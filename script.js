document.addEventListener('DOMContentLoaded', function () {
    const lawyers = [
        { name: "John Doe", specialty: "Criminal Defense", cost: 100, slots: 5 },
        { name: "Jane Smith", specialty: "Corporate Law", cost: 120, slots: 8 },
        { name: "Emily Davis", specialty: "Family Law", cost: 80, slots: 6 },
        { name: "Michael Brown", specialty: "Immigration Law", cost: 90, slots: 7 },
        { name: "Sarah Johnson", specialty: "Intellectual Property", cost: 110, slots: 4 },
    ];

    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    let slots = JSON.parse(localStorage.getItem('slots')) || lawyers.map(lawyer => lawyer.slots);

    const page = document.body.id;

    // Lawyer Availability Page
    if (page === 'lawyersPage') {
        const lawyersList = document.getElementById('lawyersList');
        lawyers.forEach((lawyer, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${lawyer.name}</strong> <br>
                Specialty: ${lawyer.specialty} <br>
                Cost per consultation: $${lawyer.cost} <br>
                Slots available: <span class="slots" data-index="${index}">${slots[index]}</span>
            `;
            lawyersList.appendChild(li);
        });
    }
    // Appointment Booking Page
    else if (page === 'appointmentPage') {
        const appointmentForm = document.getElementById('appointmentForm');
        const lawyerSelect = document.getElementById('lawyer');

        // Add placeholder
        const placeholderOption = document.createElement('option');
        placeholderOption.textContent = "Select a Lawyer";
        placeholderOption.value = "";
        lawyerSelect.appendChild(placeholderOption);

        // Populate dropdown
        lawyers.forEach((lawyer, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${lawyer.name} (${lawyer.specialty})`;
            lawyerSelect.appendChild(option);
        });

        appointmentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const lawyerIndex = parseInt(appointmentForm.lawyer.value);
            if (isNaN(lawyerIndex)) {
                alert('Please select a lawyer');
                return;
            }

            const lawyer = lawyers[lawyerIndex];
            if (slots[lawyerIndex] <= 0) {
                alert(`No slots available for ${lawyer.name}`);
                return;
            }

            const newAppointment = {
                clientName: appointmentForm.clientName.value,
                lawyerIndex,
                lawyerName: lawyer.name,
                appointmentDate: appointmentForm.appointmentDate.value,
                notes: appointmentForm.notes.value,
            };

            appointments.push(newAppointment);
            slots[lawyerIndex]--;
            localStorage.setItem('appointments', JSON.stringify(appointments));
            localStorage.setItem('slots', JSON.stringify(slots));
            alert('Appointment booked successfully!');
            appointmentForm.reset();
        });
    }
    // Appointments Page
    else if (page === 'appointmentsPage') {
        const appointmentsList = document.getElementById('appointmentsList');

        if (appointments.length === 0) {
            appointmentsList.innerHTML = `<li>No appointments found.</li>`;
        } else {
            appointments.forEach((appointment, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>Client Name:</strong> ${appointment.clientName} <br>
                    <strong>Lawyer:</strong> ${appointment.lawyerName} <br>
                    <strong>Appointment Date:</strong> ${appointment.appointmentDate} <br>
                    <strong>Notes:</strong> ${appointment.notes} <br>
                    <button class="delete-btn" data-index="${index}">Delete Appointment</button>
                `;
                appointmentsList.appendChild(li);
            });

            appointmentsList.addEventListener('click', function (e) {
                if (e.target.classList.contains('delete-btn')) {
                    const index = parseInt(e.target.dataset.index);
                    const lawyerIndex = appointments[index].lawyerIndex;

                    appointments.splice(index, 1);
                    slots[lawyerIndex]++;
                    localStorage.setItem('appointments', JSON.stringify(appointments));
                    localStorage.setItem('slots', JSON.stringify(slots));
                    alert('Appointment deleted successfully!');
                    location.reload();
                }
            });
        }
    }
});
