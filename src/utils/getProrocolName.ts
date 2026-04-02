import { Protocol } from "src/common/enums";

export const getProrocolName = (seriesDescription: string) => {
    const description = seriesDescription.toLowerCase();

    if(description.includes('t1'))
        return Protocol.T1
    else if(description.includes('t2'))
        return Protocol.T2
    else if(description.includes('pd'))
        return Protocol.PD
    else 
        return null;
}