import { FC } from "react"
import TextField from "../../../../core/components/textfield"
import { getIn, useFormikContext } from "formik"
import { ISpecies } from "../../../../core/interfaces/common.interface"
import { cloneDeep } from "lodash"
import { TPlantsDetails } from "../../../../core/types/common.types"

const TreesForms: FC = () => {

    const formikContext = useFormikContext<ISpecies<TPlantsDetails>>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const oldDetails = cloneDeep(formikContext.values.details);
        const spreadDetails = { ...oldDetails, [event.target.name]: event.target.value };
        formikContext.setFieldValue("details", spreadDetails);
    }

    const handleChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const oldDetails = cloneDeep(formikContext.values.details);
        const spreadDetails = { ...oldDetails, [event.target.name]: event.target.value };
        formikContext.setFieldValue("details", spreadDetails);
    }

    return (
        <div className="flex flex-1 flex-wrap gap-4">
            <div className="flex flex-1 flex-col gap-4">
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
                            placeholder="Distribution"
                            name="distribution"
                            value={formikContext.values.details?.distribution}
                            onChange={handleChange}
                            error={getIn(formikContext.errors.details, 'distribution') && getIn(formikContext.touched.details, 'distribution')}
                            required
                        />
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                        <TextField
                            placeholder="Conservation Status"
                            name="conservationStatus"
                            value={formikContext.values.details?.conservationStatus}
                            onChange={handleChange}
                            error={getIn(formikContext.errors.details, 'conservationStatus') && getIn(formikContext.touched.details, 'conservationStatus')}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-4">
                    <textarea
                        className="textarea textarea-bordered w-full min-h-[100px] resize-none"
                        placeholder="Economical Importance"
                        name="economicalImportance"
                        value={formikContext.values.details?.economicalImportance}
                        onChange={handleChangeTextArea}
                        required
                    ></textarea>
                    {!!getIn(formikContext.errors.details, 'economicalImportance') && getIn(formikContext.touched.details, 'economicalImportance') &&
                        <span className="text-xs pl-2 text-red-500">{getIn(formikContext.errors.details, 'economicalImportance')}</span>
                    }
                </div>
            </div>
        </div>
    )
}

export default TreesForms