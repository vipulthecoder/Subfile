
function maintenance() {
  pjs.defineDisplay("display", "subfile.json");

  while (!btnExit) {
    loadGrid();
    display.main.execute();
    if (btnAdd) addRecord();
    else processGrid();
  }

  // Load current set of records
  function loadGrid() {
    var sql = pjs.query("SELECT name, email, type, text FROM nodepf1");
    display.grid.replaceRecords(sql);
  }

  // Process any interaction with the grid
  function processGrid() {
    display.grid.readChanged();
    if (!pjs.endOfData()) {
      if (iconDelete) deleteRecord(name);
      else if (iconEdit) editDetail(name);
      else if (iconView) viewDetail(name);
    }
  }

  // Prompt to delete and then delete the record
  function deleteRecord(key_name) {
    display.delete.execute();
    if (btnYes) {
      try {
        pjs.query("DELETE FROM nodepf1 WHERE name = ? ", key_name);
      }
      catch (err) {
        displayMessage("Name " + key_name + " can not be deleted because it has products assigned.");
      }
    }
  }

  // Allow user to update a record
  function editDetail(key_name) {
    protectName = true;
    protectEmail = false;
    protectType = false;
    protectText = false;
    pjs.query("SELECT name, email, type, text FROM nodepf1 WHERE name = ? limit 1", key_name);
    display.details.execute();
    if (btnCancel) return true;

    var fieldsToUpdate = {
      email : email, type :type, text :text
    }
    pjs.query("UPDATE nodepf1 SET ? WHERE name = ?", [fieldsToUpdate, key_name]);
  }

  // Show data to the user
  function viewDetail(key_name) {
    protectName = true;
    protectEmail = true;
    protectType = true;
    protectText = true;
    pjs.query("SELECT name, email, type, text FROM nodepf1 WHERE name = ? limit 1", key_name);
    display.details.execute();
  }

  // Allow user to add a new record
  function addRecord() {
    protectName = false;
    protectEmail = false;
    protectType = false;
    protectText = false;
    name = '';
    email = '';
    type = '';
    text = '';
    display.details.execute();
    if (btnCancel)  return;
    if (recordExists(name)) {
      displayMessage("Record for " + key_name + " already exists.");
      return;
    }
    pjs.query("INSERT INTO nodepf1 SET ?", {
      name: name, email: email, type:type, text:text
    });
  }

  // Check if a record exists
  function recordExists(key_name) {
    var data = pjs.query("SELECT name FROM nodepf1 WHERE name = ? limit 1", key_name);
    return (data.count > 0);
  }

  // Display a message
  function displayMessage(message) {
    display.message.execute({ msgText: message });
  }

}

module.exports.run = maintenance;
