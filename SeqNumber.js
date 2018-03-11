function main(row_inserted) {
    // Column name to save the sequence
    var name_col_seq = "Sequence";
    // Column name to get the first field based
    var name_col_proyect = "Departement";
    // Column name to get the second field based
    var name_col_date = "Date";
    // Char numbers to set the sequence
    var num_char_base = 2;
    // Digits number to set the sequence
    var num_digits_seq = 6;
    
    var proyect = new String(row_inserted.namedValues[name_col_proyect]);
    var date = dateConvert(row_inserted.namedValues[name_col_date]);

    addSequenceNumber(name_col_seq, name_col_proyect, name_col_date, num_char_base, num_digits_seq, proyect, date);
}

// Add a sequence number in active sheet
function addSequenceNumber(name_col_seq, name_col_proyect, name_col_date, num_char_base, num_digits_seq, proyect, date) {
    // Get the sheet where we save the answers
    var sheet = SpreadsheetApp.getActiveSheet();
    // Get the last row with data
    var row = sheet.getLastRow();
    // Get col
    var col = getColumnNumByName(sheet, name_col_seq) + 1;
    // Call to function to get sequence number
    var record = getSequenceNumber(sheet, getColumnNumByName(sheet, name_col_proyect), getColumnNumByName(sheet, name_col_date), num_char_base, num_digits_seq, proyect, date.getYear());
    // Set the sequence number in the cell specified
    sheet.getRange(row, col).setValue(record);
}

// Get column of active sheet by name (or value)
function getColumnNumByName(sheet, name) {
    // Get range of sheet
    var range = sheet.getRange(1, 1, 1, sheet.getMaxColumns());
    // Get values from range
    var values = range.getValues();

    // Search cell
    for (var row in values) {
        for (var col in values[row]) {
            if (values[row][col] == name) {
                return parseInt(col);
            }
        }
    }
    throw 'Failed to get column by name';
}

// Get sequence: base + num elements with same base
function getSequenceNumber(sheet, num_col_proyect, num_col_date, num_char_base, num_digits_seq, proyect, date) {
    // Get range of sheet
    var range = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
    // Get values from range
    var values = range.getValues();
    // Counter of 
    var count = 0;

    var date_row;

    // Search cells with same proyect
    for (var row in values) {
        date_row = new Date(values[row][num_col_date]);

        if (values[row][num_col_proyect] == proyect && date_row.getYear() == date) {
            count++;
        }
    }

    // Parse to int
    count = parseInt(count);
    // Add zeros
    var seq = Array(Math.max(num_digits_seq - String(count).length + 1, 0)).join(0) + count;

    return date + "/" + proyect.substr(0, num_char_base).replace(/\s/g, "") + "/" + seq;
}

// Date converter from DD/MM/YYYY to YYYY/MM/DD
function dateConvert(date) {
    var date = new String(date);
    var dateParts = date.split("/");
    return new Date(dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0]);
}