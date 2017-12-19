module.exports = (sequelize, DataTypes) => {

	let User = sequelize.define('User', {
		name: {
			type: DataTypes.STRING,
			validate: {len: [5, 40]},
			allowNull: false,
			unique: true
		},
		passwordHash: {
			type: DataTypes.STRING,
			allowNull: false
		},
		passwordSalt: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		timestamps: false
	});

	User.associate = models => {
		User.belongsTo(models.Language, {
			as: 'nativeLanguage',
			onDelete: 'CASCADE',
			foreignKey: { allowNull: false }
		});
		User.belongsToMany(models.Language, {
			as: 'targetLanguage',
			through: 'UserLearnsLanguage'
		});
		User.belongsTo(models.Language, {
			as: 'activeLanguage'
		});
		User.belongsTo(models.Text, {
			as: 'lastOpenedText',
			constraints: false
		});
	};

	return User;
};