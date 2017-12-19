module.exports = (sequelize, DataTypes) => {
	let Language = sequelize.define('Language', {
		code: {
			type: DataTypes.STRING,
			validate: {len: [2, 3]},
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			validate: {len: [3, 30]},
			allowNull: false
		}
	},{
		timestamps: false
	});

	Language.associate = models => {
		Language.belongsToMany(models.User, {
			as: 'learner',
			through: 'UserLearnsLanguage'
		});
		Language.belongsToMany(models.User, {
			as: 'nativeSpeaker',
			onDelete: 'CASCADE',
			through: 'UserLearnsLanguage'
		});
	};

	return Language;
};