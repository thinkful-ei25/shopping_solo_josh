'use strict';

const STORE = {
    items: [
            {name: "apples", checked: false},
            {name: "oranges", checked: false},
            {name: "milk", checked: true},
            {name: "bread", checked: false}
         ],
    hideChecked: false,
}


function generateItemElement(item, itemIndex, template) {
    if(STORE.hideChecked){
        return `
            <li class="js-item-index-element ${item.checked ? "hidden" : ''}" data-item-index="${itemIndex}">
            <span class="shopping-item js-shopping-item ">${item.name}</span>
            <div class="shopping-item-controls">
                <button class="shopping-item-toggle js-item-toggle">
                    <span class="button-label">check</span>
                </button>
                <button class="shopping-item-delete js-item-edit">
                    <span class="button-label">edit</span>
                </button>
            </div>
            </li>`;
    }else{
        return `
            <li class="js-item-index-element" data-item-index="${itemIndex}">
            <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
            <div class="shopping-item-controls">
                <button class="shopping-item-toggle js-item-toggle">
                    <span class="button-label">check</span>
                </button>
                <button class="shopping-item-delete js-item-delete">
                    <span class="button-label">delete</span>
                </button>
                <button class="shopping-item-delete js-item-edit">
                    <span class="button-label">edit</span>
                </button>
            </div>
            </li>`;
    }
}


function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join("");
}

function mapByFiltered(input){
    if(input === ''){
        const shoppingListItemsString = generateShoppingItemsString(STORE.items);

        // insert that HTML into the DOM
        $('.js-shopping-list').html(shoppingListItemsString);

    }else{
        var filtered = STORE.items.filter(function(item){
            if(item.name.includes(input)){
                return item.name;
            }
        });
        
        const shoppingListItemsString = generateShoppingItemsString(filtered);
        $('.js-shopping-list').html(shoppingListItemsString);
    }   
}

function renderShoppingList() {
        console.log('`renderShoppingList` ran');
        const shoppingListItemsString = generateShoppingItemsString(STORE.items);

        // insert that HTML into the DOM
        $('.js-shopping-list').html(shoppingListItemsString);
  }


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log("Toggling checked property for item at index " + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function handleSearch(){
    $('#searchInput').submit( function(event) {
        event.preventDefault();
        const value = $('.js-searched').val();
        console.log(`you searched ${value}`);
        mapByFiltered(value);
        $('.js-searched').val('');
        if($('.searchButton i').text() === 'Clear Search'){
            $('.searchButton i').text('Submit');
        }else{
            $('.searchButton i').text('Clear Search');
        }
    });

}


function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list
  // item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
      const itemIndex = getItemIndexFromElement(event.currentTarget);
      STORE.items.splice(itemIndex, 1);
      renderShoppingList();
  });
}

function handleCheckStatus() {
    $('#checkbox').ready(function(){
        $('input[type="checkbox"]').click(function(){
            if($(this).prop("checked") == true){
                STORE.hideChecked = true;
                renderShoppingList();
                console.log("Checkbox is checked.");
            }
            else if($(this).prop("checked") == false){
                STORE.hideChecked = false;
                renderShoppingList();
                console.log("Checkbox is unchecked.");
            }
        });
    });   
}



// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleCheckStatus();
  handleSearch();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);

// to toggle between displaying all items or 
// displaying only items that are unchecked