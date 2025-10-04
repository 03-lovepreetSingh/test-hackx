const { getProjectArchiveService } = require('./src/lib/project-archive-storage.ts');

// Test the project storage service directly
async function testProjectStorageService() {
  try {
    console.log('🧪 Testing project storage service...');

    // Set environment variable
    process.env.LIGHTHOUSE_KEY = 'fb05215f.8b154384f7d8457e8d5b27a8a16219af';

    const service = getProjectArchiveService();

    // Test initializing master IPNS
    console.log('\n1. Testing master IPNS initialization...');
    await service.initializeMasterIPNS();
    console.log('✅ Master IPNS initialized successfully');

    // Test creating a project
    console.log('\n2. Testing project creation...');
    const testProject = {
      title: 'Direct Service Test Project',
      status: 'In Progress',
      description: 'This is a test project created via direct service call',
      date: '2025-01-05',
      hackathon: 'Direct Service Test Hackathon',
      technologies: ['Test', 'Direct', 'Service'],
      result: 'Testing',
      prize: '0',
      stars: 0,
      color: '#ff6b35'
    };

    const projectId = await service.createProject(testProject);
    console.log(`✅ Project created with ID: ${projectId}`);

    // Test retrieving projects
    console.log('\n3. Testing project retrieval...');
    const projects = await service.getAllProjects();
    console.log(`✅ Retrieved ${projects.length} projects`);

    const testProjectExists = projects.some(p => p.title === 'Direct Service Test Project');
    console.log(testProjectExists ? '✅ Test project found in results' : '❌ Test project not found');

    // Test getting project by ID
    console.log('\n4. Testing project retrieval by ID...');
    const retrievedProject = await service.getProjectById(projectId);
    if (retrievedProject) {
      console.log(`✅ Successfully retrieved project: ${retrievedProject.title}`);
    } else {
      console.log('❌ Failed to retrieve project by ID');
    }

    console.log('\n🎉 All service tests passed!');

  } catch (error) {
    console.error('❌ Service test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testProjectStorageService();