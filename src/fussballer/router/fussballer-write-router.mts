import {
    type FussballerCreate,
    type FussballerUpdate,
} from '../service/fussballer-write-service.mts';
import {
    FussballerNeuSchema,
    type FussballerNeuType,
    FussballerUpdateSchema,
    type FussballerUpdateType,
} from './fussballer-validation.mts';
import {
    createProblemDetails,
    preconditionRequired,
} from '../../problem-details.mts';
import { Hono } from 'hono';
import { container } from '../../container.mts';
import { createBaseUrl } from './create-base-url.mts';
import { getLogger } from '../../logger/logger.mts';
import { rolesRequired } from '../../security/roles-required.mts';

const { fussballerWriteService } = container;

export const router = new Hono();

const logger = getLogger('fussballer-write-router', 'file');

//Neu anlegen
const fussballerDtoToFussballerCreateInput = (
    fussballerDTO: FussballerNeuType,
): FussballerCreate => {
    const auszeichnungen = fussballerDTO.auszeichnungen?.map(
        (auszeichnungDTO) => {
            return {
                bezeichnung: auszeichnungDTO.bezeichnung,
                saison: auszeichnungDTO.saison,
            };
        },
    );

    const fussballer: FussballerCreate = {
        version: 0,
        nachname: fussballerDTO.nachname,
        nationalitaet: fussballerDTO.nationalitaet,
        position: fussballerDTO.position ?? null,
        geburtsdatum: fussballerDTO.geburtsdatum ?? null,
        username: fussballerDTO.username,
        adresse: {
            create: {
                plz: fussballerDTO.adresse.plz,
                ort: fussballerDTO.adresse.ort,
                bundesland: fussballerDTO.adresse.bundesland,
            },
        },
        auszeichnungen: {
            create: auszeichnungen ?? [],
        },
    };

    return fussballer;
};

router.post('/', rolesRequired('admin', 'user'), async (c) => {
    const requestBody = await c.req.json();

    const fussballerDTO = FussballerNeuSchema.parse(requestBody);
    logger.debug('post: fussballerDTO=%o', fussballerDTO);

    const fussballer =
        fussballerDtoToFussballerCreateInput(fussballerDTO);
    const id = await fussballerWriteService.create(fussballer);

    const location = `${createBaseUrl(c.req)}/${id}`;
    const { header, body } = c;
    header('Location', location);
    return body(null, 201);
});

//Ändern

