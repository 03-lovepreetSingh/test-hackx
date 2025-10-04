const { createProjectArchiveService } = require('./src/lib/project-archive-storage.ts');

// Test the project storage service directly
async function testProjectStorage() {
  try {
    console.log('Testing project storage service...');

    // Test with the correct environment variable
    process.env.LIGHTHOUSE_KEY = 'fb05215f.8b154384f7d8457e8d5b27a8a16219af';

    const service = createProjectArchiveService();

    // Test creating a project
    const testProject = {
      title: 'Test Project from Script',
      status: 'In Progress',
      description: 'This is a test project created via script',
      date: '2025-01-05',
      hackathon: 'Test Hackathon',
      technologies: ['Test', 'Script'],
      result: 'Testing',
      prize: '0',
      stars: 0,
      color: '#0092ff'
    };

    const projectId = await service.createProject(testProject);
    console.log('✅ Project created with ID:', projectId);

    // Test retrieving projects
    const projects = await service.getAllProjects();
    console.log('✅ Retrieved projects:', projects.length);

    const testProjectExists = projects.some(p => p.title === 'Test Project from Script');
    console.log(testProjectExists ? '✅ Test project found in results' : '❌ Test project not found');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProjectStorage();