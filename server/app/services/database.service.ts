import { injectable } from 'inversify';
import { Collection, MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import { SvgImage } from '../../../common/SvgImage';

import 'reflect-metadata';

const DATABASE_NAME = 'project2';
const DATABASE_COLLECTION = 'drawings';
const USER = 'log2990-20User';
const PASSWORD = 'log2990-20Password';
const CLUSTER = 'log2990cluster-efcoz.gcp.mongodb.net';

const URL = 'mongodb+srv://' + USER + ':' + PASSWORD + '@' + CLUSTER + '/test?retryWrites=true&w=majority';
@injectable()
export class DatabaseService {
    private collection: Collection<any>;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        this.connect();
    }

    async connect() {
        await MongoClient.connect(URL, this.options).then((client: MongoClient) => {
            this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
        })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS');
                process.exit(1);
            });

    }

    async getAllDrawings(): Promise<SvgImage[]> {
        return this.collection.find({}).toArray()
            .then((drawings: SvgImage[]) => {
                return drawings;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async addDrawing(drawing: SvgImage): Promise<boolean> {
        return this.collection.insertOne(drawing).then(() => {
            return true;
        }).catch((error: Error) => {
            throw error;
        });
    }

    async deleteDrawing(id: string): Promise<boolean> {
        return this.collection.deleteOne({ _id: new ObjectId(id) }).then(() => {
            return true;
        })
            .catch(() => {
                throw new Error('Failed to delete drawing');
            });
    }

}
