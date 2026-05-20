## Create a "Alchemy" Page for profession to calculate costs, margins and profits

# Context: 

  - Alchemy page is a module to calculate operation of the profession
  - Within it, there's 3 groups of consumes for the profession: Flasks, Elixirs and Potions
  - The page will calculate casting costs, expected profits, roi %, break even points and sell price,
  - The page will show different items for each group though tables
  - The page will have total profits, costs and quality for crafting each item
  - The page will have a modal to view total amounts of each crafting reagent needed for each group and the total group
  - Each item of each group has reagents needed for crafting so there will be a total to use/buy for each reagent


# Requirements:
  - The page should have 3 different sections for Flask, Elixirs and Potions
  - Each section is a table with the following headers in order:
    * Name
    * Crafting Cost
    * Breakeven
    * AH Price
    * Profit/Item
    * ROI%
    * QTY
    * Cost
    * Expected Profit
  - The last row each table will be:
    * Instead of name of the item it shows "Total"
    * "Cost", "QTY" and "Expected Profit" will be summed up and calculate a total for that column
  - QTY and AH Price should be values as inputs that can be modified
  - Add a modal with a trigger button to view the Shopping list for each group 
  - Make a Shopping list for each group (Flask, Elixirs and Potions)
  - Make a shooping list that shows the total reagents for all groups
  - This list should be tables too
    * Item
    * Amount to Buy
    * In Inventory
    * Difference
  - The colum  "In Inventory" should have an inpu to input the reagent that the user has and then a "Difference" Column to show the amount needed or exceeded.
  


DATA MODELS:

  - I need a record for groups

  Alchemy Groups Schema
  {
    GroupName: "string",
    GroupItems: [],
  }

  GroupItem Schema
  {
    Item_id,
    Craft_OP
  }

  Crafting OP
  {
    item_id,
    item_qty,
  }

  GroupItem - one to many - 
  Item Schema
  {
    ItemName: "string",
    ItemReagents: 
      {
      itemId: "string",
      itemName: "string",
      itemQty: "number",
      itemCost: "number",
    }[],
    ItemMinBuyout: number,
  }

  To calculate crafting cost: itemReagents
    cost = Suma total de (itemqty * itemscost) 

  To calculate shoppints: itemReagents
    {'itemname', 'tota' } = Suma total de itemQty
  


  - I need list of crafting items
  - Price of each item for that record
 
