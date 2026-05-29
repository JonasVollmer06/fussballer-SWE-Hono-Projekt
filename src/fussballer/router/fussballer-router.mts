/**
 * Diese Datei repräsentiert den Router für Fussballer
 * @packagedocumentation
 */

import { Hono } from 'hono'; 
import { container } from '../../container.mts';


const { buchService } = container;

export const router = new Hono();

router.get('/:id', async (c) => {
    const {req} = c;
    const accept = req.header('Accept')?.toLowerCase() ?? '*/*';

    if(accept !== '*/*' && !/(json|html)/u.test(accept)) {
        return c.body(null, 406)
    }



});

