/**
 * Diese Datei repräsentiert den Router für Fussballer
 * @packagedocumentation
 */

import { Hono } from 'hono';
import { container } from '../../container.mts';
import { createPage } from './page.mts';
import { createPageable } from '../service/pageable.mts';
import { getLogger } from '../../logger/logger.mts';

const { fussballerService } = container;

export const router = new Hono();

const logger = getLogger('fussballer-router');

// Suche mit Pfad-Parameter

router.get('/:id', async (c) => {
    const { req } = c;
    const accept = req.header('Accept')?.toLowerCase() ?? '*/*';

    if (accept !== '*/*' && !/(json|html)/u.test(accept)) {
        logger.debug('get: Accept=%s', accept);
        return c.body(null, 406);
    }

    const id = req.param('id');
    logger.debug('get: id=%s', id);
    const idNumber = Number.parseInt(id, 10);

    if (Number.isNaN(idNumber)) {
        return c.notFound();
    }

    const fussballer = await fussballerService.findById({ id: idNumber });

    // ETags
    const ifNonMatch = req.header('If-None-Match');
    const { version } = fussballer;

    if (ifNonMatch === `"${version}"`) {
        logger.debug('get: Not Modified');

        return c.body(null, 304);
    }

    logger.debug('get: version=%d', version);
    const { header, json } = c;
    header('ETag', `"${version}"`);

    logger.debug('get: %o', fussballer);
    return json(fussballer);
});

// Suche mit Query-Parameter
router.get('/', async (c) => {
    const { req } = c;
    const accept = req.header('Accept')?.toLowerCase() ?? '*/*';

    if (accept !== '*/*' && !/(json|html)/u.test(accept)) {
        logger.debug('get: Accept=%s', accept);
        return c.body(null, 406);
    }

    const queryParams = req.query();
    logger.debug('get: queryParams=%o', queryParams);

    const countOnly = queryParams['count-only'];
    if (countOnly !== undefined) {
        const count = await fussballerService.count();
        logger.debug('get: count=%d', count);

        return c.json({ count });
    }

    const { page, size } = queryParams;
    delete queryParams['page'];
    delete queryParams['size'];
    logger.debug(
        'get: page=%s, size=%s queryParams=%o',
        page,
        size,
        queryParams,
    );

    const pageable = createPageable({ number: page, size });
    const fussballerSlice = await fussballerService.find(queryParams, pageable); // NOSONAR
    const fussballerPage = createPage(fussballerSlice, pageable);
    logger.debug('get: fussballerPage=%o', fussballerPage);

    return c.json(fussballerPage);
});
