const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  siderbarMenuData: state => state.app.siderbarMenuData,
  headerMenuData: state => state.app.headerMenuData
}
export default getters
