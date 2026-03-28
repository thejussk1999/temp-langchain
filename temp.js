function fetchSheetNames(input, selectId) {
    const fileNameDisplay = input.nextElementSibling;
    const selectDropdown = document.getElementById(selectId);
    const wrapper = document.getElementById('wrapper-' + selectId);
    
    if (input.files.length === 0) return;

    // Update the visual filename
    fileNameDisplay.innerText = input.files[0].name;

    const formData = new FormData();
    formData.append('file', input.files[0]);

    fetch('/get_sheets', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(sheets => {
        // Clear previous options
        selectDropdown.innerHTML = '';
        
        if (sheets.length > 0) {
            sheets.forEach(name => {
                let opt = document.createElement('option');
                opt.value = name;
                opt.innerHTML = name;
                selectDropdown.appendChild(opt);
            });
            // Show the dropdown area
            wrapper.style.display = 'block';
        } else {
            wrapper.style.display = 'none';
        }
    });
}
