import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { SvgImage } from '../../../common/SvgImage';
import Types from '../types';
import { DatabaseService } from './../services/database.service';

@injectable()
export class DatabaseController {

    constructor(@inject(Types.DatabaseService) private databaseService: DatabaseService) {
    }

    get router(): Router {
        const router: Router = Router();

        router.get('/svgdrawings', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getAllDrawings()
                .then((images: SvgImage[]) => {
                    res.json(images);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        router.post('/svgdrawings/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.addDrawing(req.body)
                .then((result: boolean) => {
                    res.json(result);
                    res.sendStatus(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.deleteDrawing(req.params.id)
                .then((result: boolean) => {
                    res.json(result);
                    res.sendStatus(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.sendStatus(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        return router;
    }

}
