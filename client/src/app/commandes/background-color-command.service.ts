import { Injectable } from '@angular/core';
import { CommandeAbstractService } from './commande-abstract.service';

@Injectable({
    providedIn: 'root',
})
export class BackgroundColorCommand extends CommandeAbstractService {

    protected oldColor: string;
    protected newColor: string;

    constructor(color: string) {
        super();
        this.oldColor = '';
        this.newColor = color;
    }

    newToOldColor(): void {
        this.oldColor = this.newColor;
    }

    setNewColor(color: string): void {
        this.newColor = color;
    }

    getNewColor(): string {
        return this.newColor;
    }
    getOldColor(): string {
        return this.oldColor;
    }
}
