import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv2D, Flatten, MaxPooling2D, Dropout

batch_size = 32
epochs = 10
img_height = 224
img_width = 224


train_datagen = ImageDataGenerator(
    rescale=1./255,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True)

train_generator = train_datagen.flow_from_directory(
    'training',
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='binary')

validation_datagen = ImageDataGenerator(rescale=1./255)

validation_generator = validation_datagen.flow_from_directory(
    'validation',
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='binary')

model = Sequential([
    Conv2D(32, 3, activation='relu', input_shape=(img_height, img_width, 3)),
    MaxPooling2D(),
    Dropout(0.25),

    Conv2D(64, 3, activation='relu'),
    MaxPooling2D(),
    Dropout(0.25),

    Conv2D(128, 3, activation='relu'),
    MaxPooling2D(),
    Dropout(0.25),

    Flatten(),
    Dense(64, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

model.fit(train_generator,
          steps_per_epoch=train_generator.samples,
          epochs=epochs,
          validation_data=validation_generator,
          validation_steps=validation_generator.samples)
