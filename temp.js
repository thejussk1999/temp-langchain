document.getElementById('file1').addEventListener('change', function(e) {
            const file = e.target.files[0];
            const container = document.getElementById('sheet-selector-container');
            const dropdown = document.getElementById('sheet_name');

            if (!file) return;

            // If it's a CSV, it only has one "Sheet"
            if (file.name.endsWith('.csv')) {
                container.style.display = 'block';
                dropdown.innerHTML = '<option value="Default">CSV (Standard)</option>';
                return;
            }

            // If it's Excel, use FileReader + SheetJS to get sheet names
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                
                // Clear and populate dropdown
                dropdown.innerHTML = '';
                workbook.SheetNames.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    dropdown.appendChild(option);
                });

                container.style.display = 'block';
            };
            reader.readAsArrayBuffer(file);
        });
