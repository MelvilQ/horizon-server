module.exports = (sequelize, DataTypes) => {
	let Text = sequelize.define('Text', {
		title: {
			type: DataTypes.STRING,
			validate: {len: [1,60]},
			allowNull: false
			
		},
		raw: {
			type: DataTypes.TEXT,
			validate: {len: [1, 100000]},
			allowNull: false
		},
		pieces: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		wordList: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		collection: {
			type: DataTypes.STRING,
			validate: {len: [1, 100]},
			allowNull: false,
			defaultValue: 'default'
		},
		audio: {
			type: DataTypes.STRING,
			validate: {len: [8, 50]}
		}
	}, {
		timestamps: false
	});

	Text.associate = models => {
		Text.belongsTo(models.Language, {
			as: 'language',
			onDelete: 'CASCADE',
			foreignKey: { allowNull: false }
		});
		Text.belongsTo(models.User, {
			as: 'user',
			onDelete: 'CASCADE',
			foreignKey: { allowNull: false }
		});
	};

	return Text;
};