import { GraphQLObjectType } from 'graphql';
import { setOverproductionBatteryToPowerPlantRatio, setUnderproductionBatteryToPowerPlantRatio } from '../house/mutations';
import { updateElectricityPrices } from '../powerPlant/mutations';
import { setProsumerSellTimeout } from '../prosumer/mutations';
import { uploadProfilePicture } from '../picture/mutations';

const rootMutation = new GraphQLObjectType({
	name: 'RootMutation',
	fields: {
		setOverproductionBatteryToPowerPlantRatio: setOverproductionBatteryToPowerPlantRatio,
		setUnderproductionBatteryToPowerPlantRatio: setUnderproductionBatteryToPowerPlantRatio,
		updateElectricityPrices: updateElectricityPrices,
		setProsumerSellTimeout: setProsumerSellTimeout
		uploadProfilePicture: uploadProfilePicture,
	}
});

export { rootMutation };
