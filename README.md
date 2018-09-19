# ag-Grid Polymer Component

This project contains the ag-Grid Polymer 2.x Component


**This repository is now deprecated.** Please refer to the new mono-repo location here: https://github.com/ag-grid/ag-grid, with this specific 
Framework Project living here: [ag-grid-polymer](https://github.com/ag-grid/ag-grid/blob/master/packages/ag-grid-polymer/).

The code here (version 18.0.0) supports Polymer 2.x.
 
Version 19 onwards supports Polymer 3.x and can be found here: [ag-grid-polymer](https://github.com/ag-grid/ag-grid/blob/master/packages/ag-grid-polymer/).

---
 

See the [www.ag-grid.com](http://www.ag-grid.com) for an overview and full documentation.

## Installation 

#### Install with bower
```sh
$ bower install ag-grid-polymer
```

## Usage 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ag-Grid Polymer Component - Rich Example</title>

    <!-- polymer polyfill - must be before any wc related javascript is executed -->
    <script src="../../bower_components/webcomponentsjs/webcomponents-loader.js"></script>
    <link rel="import" href="../../bower_components/polymer/polymer.html">

    <!-- before the ag-grid web component -->
    <!-- either ag-grid or ag-grid-enterprise, depending on which you're using -->
    <!-- note: using noStyle version here as the you can't directly style anything in a shadow tree using a CSS rule
         outside of the shadow tree -->
    <script src="../../bower_components/ag-grid-enterprise/dist/ag-grid-enterprise.min.noStyle.js"></script>

    <!-- the ag-grid-polymer component-->
    <link rel="import" href="../../bower_components/ag-grid-polymer/ag-grid-polymer.html">

    <script src="static-data.js"></script>
     <script src="proficiencyFilter.js"></script>
     <script src="skillsFilter.js"></script>
     <link rel="import" href="simple-cell-renderer.html">
     <dom-module id="rich-grid-example">
         <template>
             <link rel="stylesheet" href="../../bower_components/ag-grid/dist/styles/ag-grid.css">
             <link rel="stylesheet" href="../../bower_components/ag-grid/dist/styles/theme-fresh.css">
             <link rel="stylesheet" href="rich-grid-example.css">
     
             <div style="width: 800px;">
                 <div style="padding: 4px">
                     <div style="float: right;">
                         <input type="text" on-input="quickFilterInput" placeholder="Type text to filter..."/>
                     </div>
                     <div style="padding: 4px;">
                         <b>Employees Skills and Contact Details</b> <span id="rowCount"/>
                     </div>
                     <div style="clear: both;"/>
                     <div style="padding: 4px;" class="toolbar">
                 <span>
                     Grid API:
                     <button on-click="selectAll">Select All</button>
                     <button on-click="deselectAll">Clear Selection</button>
                 </span>
                         <span style="margin-left: 20px;">
                     Column API:
                     <button on-click="hideCountry">Hide Country Column</button>
                     <button on-click="showCountry">Show Country Column</button>
                 </span>
                     </div>
                     <div style="float: right;" class="toolbar">
                         <button id="destroyButton" on-click="destroyGrid">Destroy Grid</button>
                     </div>
                     <div style="padding: 4px;" class="toolbar">
                         <label>
                             <input id="toolPanelToggle" type="checkbox"/>
                             Show Tool Panel
                         </label>
                         <button on-click="refreshDataViaApi">Refresh Data via API</button>
                         <button on-click="refreshDataViaElement">Refresh Data via Element</button>
                     </div>
                     <div style="clear: both;"/>
     
                     <!-- Properties can be either hypenated or camelCased-->
                     <ag-grid-polymer id="myGrid"
                                      style="height: 350px; width: 800px;display: block;"
                                      class="ag-fresh ag-basic"
                                      enableColResize
                                      enableSorting
                                      enable-filter
                                      group-headers
                                      suppress-row-click-selection
                                      tool-panel-suppress-groups
                                      tool-panel-suppress-values
                                      row-height="22"
                                      row-selection="multiple"
                                      pinned-column-count="3"
                                      on-grid-ready="[[onGridReady]]"></ag-grid-polymer>
                 </div>
             </div>
         </template>
                 
         <script>
             class RichGridExample extends Polymer.Element {
                 static get is() {
                     return "rich-grid-example";
                 }
     
                 constructor() {
                     super();
     
                     let columnDefs = [
                         {
                             headerName: '',
                             width: 30,
                             checkboxSelection: true,
                             suppressSorting: true,
                             suppressMenu: true,
                             pinned: true
                         },
                         {
                             headerName: 'Employee',
                             children: [
                                 {
                                     headerName: "Name",
                                     field: "name",
                                     width: 150,
                                     pinned: true,
                                     cellRendererFramework: 'simple-cell-renderer'
                                 },
                                 {
                                     headerName: "Country",
                                     field: "country",
                                     width: 150,
                                     cellRenderer: this.countryCellRenderer,
                                     pinned: true,
                                     filterParams: {
                                         cellRenderer: this.countryCellRenderer,
                                         cellHeight: 20
                                     }
                                 },
                             ]
                         },
                         {
                             headerName: 'IT Skills',
                             children: [
                                 {
                                     headerName: "Skills",
                                     width: 125,
                                     suppressSorting: true,
                                     cellRenderer: this.skillsCellRenderer,
                                     filter: SkillFilter
                                 },
                                 {
                                     headerName: "Proficiency",
                                     field: "proficiency",
                                     width: 120,
                                     cellRenderer: this.percentCellRenderer,
                                     filter: ProficiencyFilter
                                 },
                             ]
                         },
                         {
                             headerName: 'Contact',
                             children: [
                                 {headerName: "Mobile", field: "mobile", width: 150, filter: 'text'},
                                 {headerName: "Land-line", field: "landline", width: 150, filter: 'text'},
                                 {headerName: "Address", field: "address", width: 500, filter: 'text'}
                             ]
                         }
                     ];
     
                     this.gridOptions = {
                         columnDefs: columnDefs,
                         rowData: this.createRowData(),
                         // a callback that gets called whenever the grids data changes
                         // can access RichGridExample's "this" as we're binding to it
                         onModelUpdated: this.onModelUpdated.bind(this)
                     };
                 }
     
                 selectAll() {
                     this.gridOptions.api.selectAll()
                 }
     
                 deselectAll() {
                     this.gridOptions.api.deselectAll()
                 }
     
                 hideCountry() {
                     this.gridOptions.columnApi.setColumnVisible('country', false)
                 }
     
                 showCountry() {
                     this.gridOptions.columnApi.setColumnVisible('country', true)
                 }
     
                 toggleToolPanel(e) {
                     this.$.myGrid.showToolPanel = e.target.checked;
                 }
     
                 refreshDataViaApi() {
                     this.gridOptions.api.setRowData(this.createRowData());
                 }
     
                 refreshDataViaElement() {
                     this.$.myGrid.rowData = this.createRowData();
                 }
     
                 destroyGrid() {
                     this.gridOptions.api.destroy();
                     this.$.destroyButton.disabled = true;
                 }
     
                 quickFilterInput(e) {
                     const text = e.target.value;
                     this.gridOptions.api.setQuickFilter(text);
                 }
     
                 createRowData() {
                     const rowData = [];
     
                     for (let i = 0; i < 100; i++) {
                         //for (var i = 0; i < 10000; i++) {
                         const countryData = countries[i % countries.length];
                         rowData.push({
                             name: firstNames[i % firstNames.length] + ' ' + lastNames[i % lastNames.length],
                             skills: {
                                 android: Math.random() < 0.4,
                                 html5: Math.random() < 0.4,
                                 mac: Math.random() < 0.4,
                                 windows: Math.random() < 0.4,
                                 css: Math.random() < 0.4
                             },
                             address: addresses[i % addresses.length],
                             years: Math.round(Math.random() * 100),
                             proficiency: Math.round(Math.random() * 100),
                             country: countryData.country,
                             continent: countryData.continent,
                             language: countryData.language,
                             mobile: this.createRandomPhoneNumber(),
                             landline: this.createRandomPhoneNumber()
                         });
                     }
     
                     return rowData;
                 }
     
                 percentCellRenderer(params) {
                     const value = params.value;
     
                     const eDivPercentBar = document.createElement('div');
                     eDivPercentBar.className = 'div-percent-bar';
                     eDivPercentBar.style.width = value + '%';
                     if (value < 20) {
                         eDivPercentBar.style.backgroundColor = 'red';
                     } else if (value < 60) {
                         eDivPercentBar.style.backgroundColor = '#ff9900';
                     } else {
                         eDivPercentBar.style.backgroundColor = '#00A000';
                     }
     
                     const eValue = document.createElement('div');
                     eValue.className = 'div-percent-value';
                     eValue.innerHTML = value + '%';
     
                     const eOuterDiv = document.createElement('div');
                     eOuterDiv.className = 'div-outer-div';
                     eOuterDiv.appendChild(eDivPercentBar);
                     eOuterDiv.appendChild(eValue);
     
                     return eOuterDiv;
                 }
     
                 skillsCellRenderer(params) {
                     const data = params.data;
                     const skills = [];
                     IT_SKILLS.forEach(function (skill) {
                         if (data && data.skills[skill]) {
                             skills.push('<img src="/images/skills/' + skill + '.png" width="16px" title="' + skill + '" />');
                         }
                     });
                     return skills.join(' ');
                 }
     
                 countryCellRenderer(params) {
                     const flag = "<img border='0' width='15' height='10' style='margin-bottom: 2px' src='http://flags.fmcdn.net/data/flags/mini/" + COUNTRY_CODES[params.value] + ".png'>";
                     return flag + " " + params.value;
                 }
     
                 createRandomPhoneNumber() {
                     let result = '+';
                     for (let i = 0; i < 12; i++) {
                         result += Math.round(Math.random() * 10);
                         if (i === 2 || i === 5 || i === 8) {
                             result += ' ';
                         }
                     }
                     return result;
                 }
     
                 ready() {
                     super.ready();
                     this.$.myGrid.gridOptions = this.gridOptions;
     
                     // illustrates an alternative to using on-click or on-tap
                     this.$.toolPanelToggle.addEventListener('click', e => {
                         this.toggleToolPanel(e)
                     });
     
     
                     // add the same event in 3 different ways:
                     // 1 - adding event listener to dom element
                     // 2 - via direct element property
                     // 3 - via gridOptions
     
                     // add events to grid option 1 - add an event listener
                     this.$.myGrid.addEventListener('columnresized', function (event) {
                         console.log('event via option 1: ' + event.agGridDetails);
                     });
     
                     // add events to grid option 2 - callback on the element
                     this.$.myGrid.oncolumnresized = function (event) {
                         console.log('event via option 2: ' + event.agGridDetails);
                     };
     
                     // add events to grid option 3 - callback on the grid options
                     this.gridOptions.onColumnResized = function (event) {
                         console.log('event via option 3: ' + event);
                     };
                 }
     
                 // can only rely on this.api and this.columnApi here - "this" !== RichGridExample's "this"
                 // as we defined ths event in the ag-grid-polymer element
                 onGridReady(params) {
                     console.log("Grid is now ready");
                 }
     
                 // can access RichGridExample's "this" as we bound to it in gridOptions
                 onModelUpdated() {
                     const model = this.gridOptions.api.getModel();
                     const totalRows = this.gridOptions.rowData.length;
                     const processedRows = model.getPageLastRow() - 1;
                     this.$.rowCount.innerHTML = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
                 }
             }
             customElements.define(RichGridExample.is, RichGridExample);
         </script>
     </dom-module>
</head>
<body>
<!-- the application code -->
<rich-grid-example></rich-grid-example>
</body>
</html>
```

## Examples

See the [https://github.com/ceolter/ag-grid-polymer-example](https://github.com/ceolter/ag-grid-polymer-example) for full 
working examples of what you can do with ag-Grid and Polymer.

Examples included are:

## Simple Grid 
![Simple Grid](https://github.com/ceolter/ag-grid-polymer-example/blob/master/docs/simple.png?raw=true "Rich Grid")
## Rich Grid 
![Rich Grid](https://github.com/ceolter/ag-grid-polymer-example/blob/master/docs/rich.png?raw=true "Rich Grid")
