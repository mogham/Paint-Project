// tslint:disable: no-string-literal
// tslint:disable: no-require-imports
// tslint:disable: no-var-requires

import { fail } from 'assert';
import { expect } from 'chai';
import { Collection, Db } from 'mongodb';
import { StructSVGElement } from '../../../common/class/struct-svgelement';
import { SvgImage } from '../../../common/SvgImage';
import { container } from '../inversify.config';
import Types from '../types';
import { DatabaseService } from './database.service';

const mongoMock = require('mongo-mock');
mongoMock.max_delay = 0;
const mongoClient = mongoMock.MongoClient;

let mockCollection: Collection;

const mockedNewdrawing: SvgImage = {
    _id: '123',
    name: 'Drawingtest',
    svg: 'testSVG',
    shapes: {} as StructSVGElement[],
    tags: ['tag1', 'tag2'],
    width: '100',
    height: '100',
    backgroundColor: 'color',
};

describe('Drawing database services', () => {
    let service: DatabaseService;

    before((done) => {
        container.snapshot();
        container.rebind(Types.DatabaseService).to(DatabaseService);
        service = container.get<DatabaseService>(Types.DatabaseService);
        mongoClient.connect('mongodb://localhost:2700/projectdatabsetest', {}, (err: Error, db: Db) => {
            mockCollection = db.collection('drawings');
            service['collection'] = mockCollection;
            service['collection'].insertOne(mockedNewdrawing).then(() => {
                done();
            }).catch();
        });

    });

    after(() => {
        container.restore();
    });

    it('Get all drawings', async () => {
        const drawing: SvgImage[] = await service.getAllDrawings();
        expect(drawing.length).to.eql(1);
    });

    it('Add new draw', async () => {
        service.addDrawing(mockedNewdrawing).then((added: boolean) => {
            expect(added).to.eql(true);
        },
            () => fail(),
        );
    });

    it('Delete new draw', async () => {
        service.deleteDrawing('idtest').then((deleted: boolean) => {
            expect(deleted).to.eql(true);
        },
            () => fail(),
        );
    });
});
