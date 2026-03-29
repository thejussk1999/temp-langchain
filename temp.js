document.getElementById('file1').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const container = document.getElementById('sheet-selector-container');
    const dropdown = document.getElementById('sheet_name');

    // 1. Reset and Hide if no file is selected
    if (!file) {
        container.style.display = 'none';
        dropdown.innerHTML = '';
        return;
    }

    // 2. Immediate UI Feedback
    container.style.display = 'block';
    dropdown.innerHTML = '<option>Parsing sheets...</option>';

    // 3. Logic for CSV (No parsing needed)
    if (file.name.toLowerCase().endsWith('.csv')) {
        dropdown.innerHTML = '<option value="0">Default (CSV)</option>';
        return;
    }

    // 4. Logic for Excel (Immediate Parsing)
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            // Optimization: 'bookSheets: true' is fast, but we need the SheetNames array
            const workbook = XLSX.read(data, {
                type: 'array', 
                bookSheets: true, // Only parses names, much faster for large files
                bookProps: false,
                bookDeps: false
            });
            
            dropdown.innerHTML = ''; // Clear the "Parsing..." message
            
            if (workbook.SheetNames && workbook.SheetNames.length > 0) {
                workbook.SheetNames.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    dropdown.appendChild(option);
                });
            } else {
                dropdown.innerHTML = '<option>No sheets found</option>';
            }
        } catch (err) {
            console.error(err);
            dropdown.innerHTML = '<option>Error: Not a valid Excel file</option>';
        }
    };

    reader.onerror = function() {
        dropdown.innerHTML = '<option>File read error</option>';
    };

    reader.readAsArrayBuffer(file);
});
