import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

const memo = new Map();

function solveOptimization(truck, orders) {
    

    function backtrack(idx, totalWeight, totalVolume) {
        if (idx === orders.length) {
            return { 
                payout: 0, 
                selectedIds: [], 
                weight: 0, 
                volume: 0 
            };
        }

        const stateKey = `${idx}-${totalWeight}-${totalVolume}`;
        if (memo.has(stateKey)) {
            return memo.get(stateKey);
        }

        let bestResult = backtrack(idx + 1, totalWeight, totalVolume);

        const order = orders[idx];
        const fitsWeight = (totalWeight + order.weight_lbs) <= truck.max_weight_lbs;
        const fitsVolume = (totalVolume + order.volume_cuft) <= truck.max_volume_cuft;

        if (fitsWeight && fitsVolume) {
            const resultWith = backtrack(
                idx + 1, 
                totalWeight + order.weight_lbs, 
                totalVolume + order.volume_cuft 
            );

            const totalPayout = order.payout_cents + resultWith.payout;

            if (totalPayout > bestResult.payout) {
                bestResult = {
                    payout: totalPayout,
                    selectedIds: [order.id, ...resultWith.selectedIds],
                    weight: order.weight_lbs + resultWith.weight,
                    volume: order.volume_cuft + resultWith.volume
                };
            }
        }

        memo.set(stateKey, bestResult);
        return bestResult;
    }

    return backtrack(0, 0, 0);
}

app.post('/api/v1/load-optimizer/optimize', (req, res) => {
    const { truck, orders } = req.body;

    if (!truck?.id || truck.max_weight_lbs <= 0 || truck.max_volume_cuft <= 0) {
        return res.status(400).json({ error: "Invalid input schema or parameters" });
    }

    const result = solveOptimization(truck, orders);

    const weightUtil = ((result.weight / truck.max_weight_lbs) * 100).toFixed(2);
    const volumeUtil = ((result.volume / truck.max_volume_cuft) * 100).toFixed(2);
    
    res.status(200).json({
        truck_id: truck.id,
        selected_order_ids: result.selectedIds,
        total_payout_cents: result.payout,
        total_weight_lbs: result.weight,
        total_volume_cuft: result.volume,
        utilization_weight_percent: parseFloat(weightUtil),
        utilization_volume_percent: parseFloat(volumeUtil)
    });
});


app.get('/healthz', (req, res) => res.status(200).send('working'));

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});