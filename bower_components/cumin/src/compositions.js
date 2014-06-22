(function(_){
  _.pluck = _.compose(_.map, _.dot);
  
  _.pick = _.compose(_.filter, _.position, _.within);
  _.omit = _.compose(_.filter, _.position, _.not, _.within);
}(_));