import { FC } from "react"
import TextField from "../../../../core/components/textfield"
import { getIn, useFormikContext } from "formik"
import { ISpecies } from "../../../../core/interfaces/common.interface"
import { cloneDeep } from "lodash"
import { TInsectDetails } from "../../../../core/types/common.types"

const InsectsForm: FC = () => {

    const formikContext = useFormikContext<ISpecies<TInsectDetails>>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const oldDetails = cloneDeep(formikContext.values.details);
        const spreadDetails = { ...oldDetails, [event.target.name]: event.target.value };
        formikContext.setFieldValue("details", spreadDetails);
    }

    return (
        <div className="flex flex-1 flex-wrap gap-4">
            <div className="flex flex-1 flex-row gap-4">
                <div className="flex flex-1 flex-col gap-4">
                    <TextField
                        placeholder="Endemism"
                        name="endemism"
                        value={formikContext.values.details?.endemism}
                        onChange={handleChange}
                        error={getIn(formikContext.errors.details, 'endemism') && getIn(formikContext.touched.details, 'endemism')}
                        required
                    />
                    <TextField
                        placeholder="Diet"
                        name="diet"
                        value={formikContext.values.details?.diet}
                        onChange={handleChange}
                        error={getIn(formikContext.errors.details, 'diet') && getIn(formikContext.touched.details, 'diet')}
                        required
                    />
                    <TextField
                        placeholder="Distribution"
                        name="distribution"
                        value={formikContext.values.details?.distribution}
                        onChange={handleChange}
                        error={getIn(formikContext.errors.details, 'distribution') && getIn(formikContext.touched.details, 'distribution')}
                        required
                    />
                    <TextField
                        placeholder="IUCN Status"
                        name="iucnStatus"
                        value={formikContext.values.details?.iucnStatus}
                        onChange={handleChange}
                        error={getIn(formikContext.errors.details, 'iucnStatus') && getIn(formikContext.touched.details, 'iucnStatus')}
                    />
                </div>
                <div className="flex flex-1 flex-col gap-4">
                    <TextField
                        placeholder="Habitats"
                        name="habitats"
                        value={formikContext.values.details?.habitats}
                        onChange={handleChange}
                        error={getIn(formikContext.errors.details, 'habitats') && getIn(formikContext.touched.details, 'habitats')}
                        required
                    />
                    <TextField
                        placeholder="Conservation Status"
                        name="conservationStatus"
                        value={formikContext.values.details?.conservationStatus}
                        onChange={handleChange}
                        error={getIn(formikContext.errors.details, 'conservationStatus') && getIn(formikContext.touched.details, 'conservationStatus')}
                        required
                    />
                    <TextField
                        placeholder="Ecological Importance"
                        name="ecologicalImportance"
                        value={formikContext.values.details?.ecologicalImportance}
                        onChange={handleChange}
                        error={getIn(formikContext.errors.details, 'ecologicalImportance') && getIn(formikContext.touched.details, 'ecologicalImportance')}
                        required
                    />
                </div>
            </div>
        </div>
    )
}

export default InsectsForm