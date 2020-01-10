import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import {CloudService} from '../services/cloud.services';
import Types from '../types';

@injectable()
export class CloudController {

    constructor(@inject(Types.CloudService) private cloudService: CloudService) { /** */ }

    get router(): Router {
        const router: Router = Router();

        router.get('/svgdrawings', async (req: Request, res: Response, next: NextFunction) => {
            res.json(this.cloudService.allsvg);
        });

        router.get('/svgdrawings/keys', async (req: Request, res: Response, next: NextFunction) => {
            res.json(this.cloudService.allKey);
        });

        router.post('/svgdrawings/', async (req: Request, res: Response, next: NextFunction) => {
            this.cloudService.addsvg(req.body);
        });

        router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
            this.cloudService.removesvg(req.params.id);
        });

        return router;
    }

}
