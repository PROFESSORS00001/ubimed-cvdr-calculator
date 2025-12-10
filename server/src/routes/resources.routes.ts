import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    const resources = {
        charts: [
            {
                name: "WHO/ISH Lab",
                description: "Risk prediction with cholesterol",
                url: "/assets/who_ish_lab.png" // placeholder
            },
            {
                name: "WHO/ISH Non-Lab",
                description: "Risk prediction without cholesterol",
                url: "/assets/who_ish_non_lab.png"
            }
        ],
        citations: [
            "World Health Organization. WHO/ISH Cardiovascular Risk Prediction Charts. Geneva: WHO.",
            "D'Agostino, R. B., et al. (2008). General cardiovascular risk profile for use in primary care: the Framingham Heart Study. Circulation."
        ]
    };
    res.json(resources);
});

export default router;
