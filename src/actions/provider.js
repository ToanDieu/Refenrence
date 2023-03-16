import { store } from "@/store/configureStore";

class Provider {
  constructor() {
    this.store = store;
  }
  orgNameProvider = action => {
    const orgName = this.store.getState().getOrgName.data;
    return action(orgName);
  };
}

export const accessStore = () => {
  return new Provider();
};
