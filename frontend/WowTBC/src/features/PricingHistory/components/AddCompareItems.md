### Add a feature to see multiple item prices in the same chart.

1. Create a store item in zustand for this feature.
    - Make it a list of objects like: {
        name: string; 
        id: string; 
        icon: string; 
        chartData: [
            {
                date: string; 
                marketValue: number; 
                minBuyout: number; 
                historical: number; 
                numAuctions: number;
            }
        ]
    }
2. Use this data to create a chart with multiple lines.
    - Make the current chart into a bar chart showing the last record in the serie, each serie should have its own
    - Each list should defferentiate from others and have the own color scheme

3. Use this data to render the component list at frontend\WowTBC\src\features\PricingHistory\components\CompareItemSection.tsx 

4. I want to be able to add, remove, and list items to compare.

5. Allow toggling between data sets like Market Value, Min Buyout, NumAuctions, Historical, etc. on top of the chart to only show one or multiple.
