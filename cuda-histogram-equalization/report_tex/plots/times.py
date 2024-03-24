import matplotlib.pyplot as plt

# Sample times for each test
times = {
    'flower2.jpg': [0.1968, 20.8876, 1.2869], imageSize = W = 280, H = 180
    'pa3cio.jpg': [0.1918, 52.0048, 2.5469],  imageSize = W = 400, H = 250
    'ograja.jpg': [0.2159, 230.8772, 6.1029], imageSize = W = 400, H = 600
    'ferari.jpg': [0.2082, 197.1191, 5.1372],   imageSize = W = 600, H = 338
    'puscava.jpg': [0.3530, 1513.1527, 17.7262],    imageSize = W = 1024, H = 683
    'flower1.jpg': [0.4385, 2380.4128, 23.3550],   imageSize = W = 1280, H = 720
    'buca1.jpg': [1.1806, 49685.0430, 110.7117],     imageSize = W = 2560, H = 1707
}


# Create figure and axes
fig, ax = plt.subplots()

# Plot the times for each sample with connected lines
for sample in sorted_samples:
    ax.plot(times[sample], '-o', label=sample)

# Label the axes and the plot
ax.set_xlabel('Test Number')
ax.set_ylabel('Time (miliseconds)')
ax.set_title('Comparison of Test Times')
ax.set_xticks([0, 1, 2])
ax.set_xticklabels(['Test 1', 'Test 2', 'Test 3'])

# Use a logarithmic scale for the y-axis
plt.yscale('log')

# Add a legend
ax.legend(title='Samples')

# Show the plot
plt.show()