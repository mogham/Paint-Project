import * as admin from 'firebase-admin';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { SvgImage } from '../../../common/SvgImage';

@injectable()
export class CloudService {
    items: any;
    db: any;
    allKey: string[] = [];
    allsvg: SvgImage[] = [];
    constructor() {
        // tslint:disable-next-line: max-line-length
        const serviceAccount: any = require(process.cwd() + String.fromCharCode(92) + 'app' + String.fromCharCode(92) + 'services' + String.fromCharCode(92) + 'log2990-20-a19-firebase-adminsdk-4b93g-bfa512d882.json');
        admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://log2990-20-a19.firebaseio.com',
        });
        this.getallsvg();
    }

    async getallsvg() {
        this.db = admin.database().ref('/drawings');
        return this.db.on('child_added', (data: any, prevChildKey: any) => {
            this.allKey.push(data.key);
            this.allsvg.push(data.val());
        });
    }

    async addsvg(svg: SvgImage) {
        this.db = admin.database().ref('/drawings');
        this.db.child(svg._id).set(svg);
    }

    async removesvg(id: string) {
        this.db = admin.database().ref('/drawings').child(id).remove();
        this.getallsvg();
    }
}
